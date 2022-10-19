const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/constants');

exports.register = async ({ firstName, lastName, email, password }) => await User.create({ firstName, lastName, email, password });

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

exports.getUserWithPosts = async (id) => User.findById(id).populate('myPosts').lean();

exports.getUserLeaned = async (id) => User.findById(id).lean();