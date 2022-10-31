const jwt = require('jsonwebtoken');
const { sessionName, secret } = require("../config/constants");

exports.auth = (req, res, next) => {
    const token = req.cookies[sessionName];

    if (token) {
        jwt.verify(token, secret, ((err, decodedToken) => {
            if (err) {
                res.clearCookie(sessionName);

                return next(err);
            }

            req.user = decodedToken;
            res.locals.user = decodedToken;

            next();
        }));
    } else {
        next();
    }
};

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    next();
};

exports.isGuest = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }

    next();
};