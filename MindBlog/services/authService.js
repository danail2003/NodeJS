const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/constants');

exports.register = async ({ username, email, password }) => await User.create({ username, email, password });

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });
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

exports.getUser = async (id) => User.findById(id);

exports.getUserLeaned = async (id) => User.findById(id).lean();