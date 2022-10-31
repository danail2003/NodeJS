const bcrypt = require('bcrypt');
const router = require('express').Router();
const authService = require('../services/authService');
const { sessionName, salt } = require('../config/constants');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    let { username, email, password, rePassword } = req.body;

    if (username.length < 2) {
        return res.render('auth/register', { error: 'First name should be at least 2 symbols!', register: req.body });
    }

    if (email.length < 10) {
        return res.render('auth/register', { error: 'Email should be in at least 10 symbols !', register: req.body });
    }

    if (password.length < 4) {
        return res.render('auth/register', { error: 'Password should be in at least 4 symbols !', register: req.body });
    }

    if (password !== rePassword) {
        return res.render('auth/register', { error: 'Password and Repeat Password should be same!', register: req.body });
    }

    password = bcrypt.hashSync(password, salt);

    await authService.register({ username, email, password });

    res.redirect('/');
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.login({ email, password });
    const token = authService.createToken(user);

    res.cookie(sessionName, token, { httpOnly: true });
    res.redirect('/');
});

router.get('/profile', isAuth, async (req, res) => {
    res.render('auth/profile');
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(sessionName);
    res.redirect('/');
});

module.exports = router;