const router = require('express').Router();
const blogService = require('../services/blogService');

router.get('/', async (req, res) => {
    const lastBlogs = await blogService.getLastThree();
    console.log(lastBlogs);

    res.render('general/home', { lastBlogs });
});

module.exports = router;