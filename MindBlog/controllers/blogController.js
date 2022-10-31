const router = require('express').Router();
const blogService = require('../services/blogService');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/create', isAuth, (req, res) => {
    res.render('blogs/create');
});

router.post('/create', isAuth, async (req, res) => {
    const { title, image, content, blogCategory } = req.body;

    if (title.length < 5 || title.length > 50) {
        return res.render('blogs/create', { error: 'Title should be between 5 and 50 symbols long!', blog: req.body });
    }

    if (!image.startsWith('http')) {
        return res.render('blogs/create', { error: 'Image should start with http/s!', blog: req.body });
    }

    if (content.length < 10) {
        return res.render('blogs/create', { error: 'Title should be at least 10 symbols long!', blog: req.body });
    }

    if (blogCategory.length < 3) {
        return res.render('blogs/create', { error: 'Category should be at least 3 symbols long!', blog: req.body });
    }

    const owner = req.user.userId
    await blogService.create({ title, image, content, blogCategory, owner });

    res.redirect('/blogs/catalog');
});

router.get('/catalog', async (req, res) => {
    const blogs = await blogService.getAllLeaned();
    res.render('blogs/catalog', { blogs });
});

router.get('/details/:id', async (req, res) => {
    const blog = await blogService.getByIdWithOwnerLeaned(req.params.id);
    const isOwner = blog.owner._id == req.user?.userId;
    const isFollower = blog.followList.map(x => x._id.toString()).includes(req.user?.userId);
    const followers = blog.followList.map(x => x.email).join(', ');

    res.render('blogs/details', { blog, isOwner, isFollower, followers });
});

router.get('/delete/:id', isAuth, async (req, res) => {
    await blogService.delete(req.params.id);

    res.redirect('/blogs/catalog');
});

router.get('/edit/:id', isAuth, async (req, res) => {
    const blog = await blogService.getByIdLeaned(req.params.id);

    res.render('blogs/edit', { blog });
});

router.post('/edit/:id', isAuth, async (req, res) => {
    const { title, image, content, blogCategory } = req.body;

    if (title.length < 5 || title.length > 50) {
        return res.render('blogs/edit', { error: 'Title should be between 5 and 50 symbols long!', blog: req.body });
    }

    if (!image.startsWith('http')) {
        return res.render('blogs/edit', { error: 'Image should start with http/s!', blog: req.body });
    }

    if (content.length < 10) {
        return res.render('blogs/edit', { error: 'Title should be at least 10 symbols long!', blog: req.body });
    }

    if (blogCategory.length < 3) {
        return res.render('blogs/edit', { error: 'Category should be at least 3 symbols long!', blog: req.body });
    }

    await blogService.edit(req.params.id, req.body);

    res.redirect(`/blogs/details/${req.params.id}`);
});

router.get('/follow/:id', isAuth, async (req, res) => {
    const blog = await blogService.getById(req.params.id);
    blog.followList.push(req.user.userId);

    blog.save();

    res.redirect(`/blogs/details/${req.params.id}`);
});

module.exports = router;