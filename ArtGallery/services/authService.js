const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/constants');

exports.register = async ({ username, password, address }) => User.create({ username, password, address });

exports.login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return;
    }

    return user;
};

exports.getUser = (userId) => User.findOne({ userId });

exports.addPublication = async (publicationId, userId) => {
    const user = await User.findById(userId);

    user.publications.push(publicationId);
    await user.save();

    return user;
};

exports.createToken = (user) => {
    const payload = { userId: user._id, username: user.username };

    return jwt.sign(payload, secret, { expiresIn: '2d' });
};