const { isAuth } = require('../middlewares/authMiddleware');
const postsService = require('../services/postsService');
const authService = require('../services/authService');

const router = require('express').Router();

router.get('/create', isAuth, async (req, res) => {
    const user = await authService.getUserLeaned(req.user.userId);
    const email = { 'email-of-user': user.email };

    res.render('posts/create', { 'email-of-user': email['email-of-user'] });
});

router.post('/create', isAuth, async (req, res) => {
    const { title, keyword, location, date, image, description } = req.body;

    if (title.length < 6) {
        return res.render('posts/create', { error: 'Title should be at least 6 symbols long !', post: req.body });
    }

    if (keyword.length < 6) {
        return res.render('posts/create', { error: 'Keyword should be at least 6 symbols long !', post: req.body });
    }

    if (location.length > 15) {
        return res.render('posts/create', { error: 'Location should not be more than 15 symbols long !', post: req.body });
    }

    if (!/^\d{2}.\d{2}.\d{4}$/.test(date)) {
        return res.render('posts/create', { error: 'Date should be at this format: 02.02.2021 !', post: req.body });
    }

    if (!image.startsWith('http')) {
        return res.render('posts/create', { error: 'Image should start with http !', post: req.body });
    }

    if (description.length < 8) {
        return res.render('posts/create', { error: 'Title should be at least 8 symbols long !', post: req.body });
    }

    const post = await postsService.create({ author: req.user.userId, ...req.body });

    const user = await authService.getUser(req.user.userId);
    user.myPosts.push(post);
    user.save();

    res.redirect('/posts/all');
});

router.get('/all', async (req, res) => {
    const posts = await postsService.getAllLeaned();

    const user = await authService.getUserLeaned(req.user?.userId);
    if (user) {
        const email = { 'email-of-user': user.email };

        return res.render('posts/all-posts', { posts, 'email-of-user': email['email-of-user'] });
    }

    res.render('posts/all-posts', { posts });
});

router.get('/details/:id', async (req, res) => {
    const post = await postsService.getByIdLeaned(req.params.id);
    const isAuth = req.user.userId !== undefined;
    const isAuthor = post.author._id == req.user.userId;
    const isVoted = post.votes.map(x => x.toString()).includes(req.user?.userId);
    const votedPeople = post.votes.map(x => x.email).join(', ');

    const user = await authService.getUserLeaned(req.user?.userId);
    if (user) {
        const email = { 'email-of-user': user.email };

        return res.render('posts/details', { post, isAuthor, isAuth, isVoted, votedPeople, 'email-of-user': email['email-of-user'] });
    }

    res.render('posts/details', { post, isAuthor, isAuth, isVoted, votedPeople });
});

router.get('/delete/:id', isAuth, async (req, res) => {
    await postsService.delete(req.params.id);
    res.redirect('/posts/all');
});

router.get('/edit/:id', isAuth, async (req, res) => {
    const post = await postsService.getByIdLeaned(req.params.id);
    const user = await authService.getUserLeaned(req.user?.userId);
    const email = { 'email-of-user': user.email };

    return res.render('posts/edit', { post, 'email-of-user': email['email-of-user'] });
});

router.post('/edit/:id', isAuth, async (req, res) => {
    const { title, keyword, location, date, image, description } = req.body;

    if (title.length < 6) {
        return res.render('posts/edit', { error: 'Title should be at least 6 symbols long !', post: req.body });
    }

    if (keyword.length < 6) {
        return res.render('posts/edit', { error: 'Keyword should be at least 6 symbols long !', post: req.body });
    }

    if (location.length > 15) {
        return res.render('posts/edit', { error: 'Location should not be more than 15 symbols long !', post: req.body });
    }

    if (!/^\d{2}.\d{2}.\d{4}$/.test(date)) {
        return res.render('posts/edit', { error: 'Date should be at this format: 02.02.2021 !', post: req.body });
    }

    if (!image.startsWith('http')) {
        return res.render('posts/edit', { error: 'Image should start with http !', post: req.body });
    }

    if (description.length < 8) {
        return res.render('posts/edit', { error: 'Title should be at least 8 symbols long !', post: req.body });
    }

    await postsService.edit(req.params.id, req.body);

    res.redirect(`/posts/details/${req.params.id}`);
});

router.get(`/vote/:id/1`, isAuth, async (req, res) => {
    const post = await postsService.getById(req.params.id);
    const isAuthor = post.author === req.user?.userId;

    if (isAuthor) {
        return res.render('404', { error: 'You are the author of the post!' });
    }

    const hasVoted = post.votes.map(x => x.toString()).includes(req.user.userId);

    if (hasVoted) {
        return res.render('404', { error: 'You already voted in that post!' });
    }

    post.votes.push(req.user.userId);
    post.rating += 1;
    post.save();

    return res.redirect(`/posts/details/${req.params.id}`);
});

router.get(`/vote/:id/-1`, isAuth, async (req, res) => {
    const post = await postsService.getById(req.params.id);
    const isAuthor = post.author === req.user?.userId;

    if (isAuthor) {
        return res.render('404', { error: 'You are the author of the post!' });
    }

    const hasVoted = post.votes.map(x => x.toString()).includes(req.user.userId);

    if (hasVoted) {
        return res.render('404', { error: 'You already voted in that post!' });
    }

    post.votes.push(req.user.userId);
    post.rating -= 1;
    post.save();

    return res.redirect(`/posts/details/${req.params.id}`);
});

router.get('/user', isAuth, async (req, res) => {
    const posts = await authService.getUserWithPosts(req.user?.userId);
    const user = await authService.getUserLeaned(req.user?.userId);

    res.render('posts/my-posts', { posts, user });
});

module.exports = router;