const router = require('express').Router();
const housingService = require('../services/housingService');

router.get('/', async (req, res) => {
    const offers = await housingService.getLatestOffers();

    res.render('general/home', { offers });
});

module.exports = router;