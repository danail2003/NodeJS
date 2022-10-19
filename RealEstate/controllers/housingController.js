const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const housingService = require('../services/housingService');

router.get('/create', isAuth, (req, res) => {
    res.render('housing/create');
});

router.post('/create', isAuth, async (req, res) => {
    const { name, year, city, homeImage, propertyDescription, availablePieces } = req.body;

    if (name.length < 6) {
        return res.render('housing/create', { error: 'Name must be at least 6 symbols long!', housing: req.body });
    }

    if (year < 1850 || year > 2021) {
        return res.render('housing/create', { error: 'Year must be between 1850 and 2021!', housing: req.body });
    }

    if (city.length < 4) {
        return res.render('housing/create', { error: 'City must be at least 4 symbols long!', housing: req.body });
    }

    if (!homeImage.startsWith('http')) {
        return res.render('housing/create', { error: 'Image must start with http/s!', housing: req.body });
    }

    if (propertyDescription.length > 60) {
        return res.render('housing/create', { error: 'Description must be less than 60 symbols!', housing: req.body });
    }

    if (Number(availablePieces) < 0 || Number(availablePieces > 10)) {
        return res.render('housing/create', { error: 'Available pieces must be between 0 and 10!', housing: req.body });
    }

    await housingService.create({ owner: req.user.userId, ...req.body });

    res.redirect('/housing/rent');
});

router.get('/rent', isAuth, async (req, res) => {
    const offers = await housingService.getAll();
    res.render('housing/aprt-for-recent', { offers });
});

router.get('/details/:id', async (req, res) => {
    const house = await housingService.getById(req.params.id);
    console.log(house);
    const isOwner = house.owner == req.user?.userId;
    const isRented = house.rentedAHome.map(x => x.toString()).includes(req.user?.userId);
    const hasAvailablePieces = house.availablePieces > 0;
    const rentedPeople = house.rentedAHome.map(x => x.name).join(', ');

    res.render('housing/details', { house, isOwner, isRented, hasAvailablePieces, rentedPeople });
});

router.get('/delete/:id', async (req, res) => {
    await housingService.delete(req.params.id);

    res.redirect('/housing/rent');
});

router.get('/edit/:id', async (req, res) => {
    const house = await housingService.getById(req.params.id);

    res.render('housing/edit', { house });
});

router.post('/edit/:id', async (req, res) => {
    const { name, year, city, homeImage, propertyDescription, availablePieces } = req.body;

    if (name.length < 6) {
        return res.render('housing/create', { error: 'Name must be at least 6 symbols long!', housing: req.body });
    }

    if (year < 1850 || year > 2021) {
        return res.render('housing/create', { error: 'Year must be between 1850 and 2021!', housing: req.body });
    }

    if (city.length < 4) {
        return res.render('housing/create', { error: 'City must be at least 4 symbols long!', housing: req.body });
    }

    if (!homeImage.startsWith('http')) {
        return res.render('housing/create', { error: 'Image must start with http/s!', housing: req.body });
    }

    if (propertyDescription.length > 60) {
        return res.render('housing/create', { error: 'Description must be less than 60 symbols!', housing: req.body });
    }

    if (Number(availablePieces) < 0 || Number(availablePieces > 10)) {
        return res.render('housing/create', { error: 'Available pieces must be between 0 and 10!', housing: req.body });
    }

    await housingService.editById(req.params.id, req.body);

    res.redirect(`/housing/details/${req.params.id}`);
});

router.get('/rent/:id', isAuth, async (req, res) => {
    const property = await housingService.getByIdWithoutLean(req.params.id);

    if (property.availablePieces > 0 && !property.rentedAHome.includes(req.user.userId) && property.owner !== req.user.userId) {
        property.rentedAHome.push(req.user.userId);
        property.availablePieces -= 1;
        await property.save();
    }

    res.redirect(`/housing/details/${property._id}`);
});

router.get('/search', async (req, res) => {
    res.render('housing/search');
});

router.post('/search', async (req, res) => {
    const { type } = req.body;

    const result = await housingService.search(type);
    console.log(result);

    res.render('housing/search', { result });
});

module.exports = router;