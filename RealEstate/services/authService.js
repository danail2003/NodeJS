const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/constants');

exports.register = async ({ name, username, password }) => await User.create({ name, username, password });

exports.login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return;
    }

    return user;
};

exports.createToken = (user) => {
    const payload = { userId: user._id, username: user.username };

    return jwt.sign(payload, secret, { expiresIn: '2d' });
};