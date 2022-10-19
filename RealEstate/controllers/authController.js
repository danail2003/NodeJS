const router = require('express').Router();
const authService = require('../services/authService');
const { sessionName } = require('../config/constants');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { name, username, password, rePassword } = req.body;

    if (password !== rePassword) {
        return res.render('auth/register', { error: 'Password and Repeat Password must be same!' });
    }

    await authService.register({ name, username, password });

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

module.exports = router;