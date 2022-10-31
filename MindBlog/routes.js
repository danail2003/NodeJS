const router = require('express').Router();
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const blogController = require('./controllers/blogController');

router.use(homeController);
router.use('/auth', authController);
router.use('/blogs', blogController);

router.use('*', (req, res) => {
    res.render('general/404');
});

module.exports = router;