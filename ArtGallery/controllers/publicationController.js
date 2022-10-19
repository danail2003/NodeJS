const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const publicationService = require('../services/publicationService');
const authService = require('../services/authService');

router.get('/create', isAuth, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
    const { title, paintingTechnique } = req.body;

    if (title.length < 6) {
        return res.render('publication/create', { error: 'Title must be at least 6 symbols.' });
    }

    if (paintingTechnique.length > 15) {
        return res.render('publication/create', { error: 'Painting Technique must be less than 15 symbols.' });
    }

    const publication = await publicationService.create({ author: req.user.userId, ...req.body });

    await authService.addPublication(publication._id, req.user.userId);

    res.redirect('/publication/gallery');
});

router.get('/gallery', async (req, res) => {
    const publications = await publicationService.getAll().lean();

    res.render('publication/gallery', { publications });
});

router.get('/details/:id', async (req, res) => {
    const publication = await publicationService.getOne(req.params.id).lean();
    const isAuthor = req.user?.userId == publication.author._id;
    const isShared = publication.usersShared.map(x => x.toString()).includes(req.user?.userId);

    res.render('publication/details', { publication, isAuthor, isShared });
});

router.get('/edit/:id', isAuth, async (req, res) => {
    const publication = await publicationService.getOne(req.params.id).lean();
    const isAuthor = req.user?.userId == publication.author._id;

    if (!isAuthor) {
        return res.redirect('404', { error: 'You are not authorized!' });
    }

    res.render('publication/edit', { publication });
});

router.post('/edit/:id', isAuth, async (req, res) => {
    const publication = await publicationService.getOne(req.params.id).lean();
    const isAuthor = req.user.userId == publication.author._id;

    if (!isAuthor) {
        return res.render('404', { error: 'You are not authorized!' });
    }

    await publicationService.edit(req.params.id, req.body);

    res.redirect(`/publication/details/${req.params.id}`);
});

router.get('/delete/:id', isAuth, async (req, res) => {
    await publicationService.delete(req.params.id);

    res.redirect('/publication/gallery');
});

router.get('/share/:id', isAuth, async (req, res) => {
    const publication = await publicationService.getOne(req.params.id);
    const isShared = publication.usersShared.includes(req.user?.userId);
    const isAuthor = req.user?.userId == publication.author._id;

    if (isAuthor) {
        return res.render('404', { error: 'You can not share this publication because you are the author!' });
    }

    if (isShared) {
        return res.render('404', { error: 'You have already shared this publication!' });
    }

    publication.usersShared.push(req.user?.userId);
    await publication.save();

    res.redirect('/');
});

module.exports = router;