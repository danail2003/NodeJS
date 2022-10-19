const router = require('express').Router();
const { sessionName } = require('../config/constants');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
const publicationService = require('../services/publicationService');

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { username, password, rePassword, address } = req.body;

    if (username.length < 4) {
        return res.render('auth/register', { error: 'Username must be at least 4 symbols!' });
    }

    if (password.length < 3) {
        return res.render('auth/register', { error: 'Password must be at least 3 symbols!' });
    }

    if (password !== rePassword) {
        return res.render('auth/register', { error: 'Password and Repeat Password must be same!' });
    }

    if (address.length > 20) {
        return res.render('auth/register', { error: 'Address must be less than 20 symbols!' });
    }

    const user = await authService.register(req.body);
    const token = authService.createToken(user);

    res.cookie(sessionName, token);

    res.redirect('/');
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const { username, password } = req.body;

    const user = await authService.login({ username, password });
    const token = authService.createToken(user);

    res.cookie(sessionName, token, { httpOnly: true });
    res.redirect('/');
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(sessionName);
    res.redirect('/');
});

router.get('/profile', isAuth, async (req, res) => {
    const user = await authService.getUser(req.user.userId).populate('publications').lean();
    const publicationsTitles = user.publications.map(x => x.title).join(', ');
    let publications = await publicationService.getAll().lean();
    const sharedPublications = publications.filter(x => x.usersShared.map(x => x.toString()).includes(req.user.userId)).map(x => x.title).join(', ');

    res.render('auth/profile', { user, publicationsTitles, sharedPublications });
});

module.exports = router;