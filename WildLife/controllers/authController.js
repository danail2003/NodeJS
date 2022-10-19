const bcrypt = require('bcrypt');
const router = require('express').Router();
const authService = require('../services/authService');
const { sessionName, salt } = require('../config/constants');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    let { firstName, lastName, email, password, rePassword } = req.body;

    if (firstName.length < 3) {
        return res.render('auth/register', { error: 'First name should be at least 3 symbols!', register: req.body });
    }

    if (lastName.length < 5) {
        return res.render('auth/register', { error: 'First name should be at least 5 symbols!', register: req.body });
    }

    if (!/^[a-z]+@[a-z]+.[a-z]+$/.test(email)) {
        return res.render('auth/register', { error: 'Email should be in this format: name@domain.extension !', register: req.body });
    }

    if (password !== rePassword) {
        return res.render('auth/register', { error: 'Password and Repeat Password should be same!', register: req.body });
    }

    password = bcrypt.hashSync(password, salt);

    const user = await authService.register({ firstName, lastName, email, password });
    const token = authService.createToken(user);

    res.cookie(sessionName, token);

    res.redirect('/');
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    if (!/^[a-z]+@[a-z]+.[a-z]+$/.test(email)) {
        return res.render('auth/login', { error: 'Email should be in this format: name@domain.extension !' });
    }

    const user = await authService.login({ email, password });
    const token = authService.createToken(user);

    res.cookie(sessionName, token, { httpOnly: true });
    res.redirect('/');
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(sessionName);
    res.redirect('/');
});

module.exports = router;