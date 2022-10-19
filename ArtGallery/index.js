const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const { initializeDb } = require('./config/database');

const { PORT } = require('./config/env');
const routes = require('./routes');
const { auth } = require('./middlewares/authMiddleware');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.engine('hbs', hbs.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.use(cookieParser());
app.use(auth);
app.use(routes);

initializeDb()
    .then(() => {
        app.listen(PORT, console.log(`App is listening on port ${PORT}`));
    })
    .catch((err) => {
        console.log(err.message);
    });
