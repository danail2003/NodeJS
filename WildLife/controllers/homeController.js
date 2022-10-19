const router = require('express').Router();
const authService = require('../services/authService');

router.get('/', async (req, res) => {
    const user = await authService.getUserLeaned(req.user?.userId);
    if (user) {
        const email = { 'email-of-user': user.email };

        return res.render('general/home', { 'email-of-user': email['email-of-user'] });
    }

    res.render('general/home');
});

module.exports = router;