const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { salt } = require('../config/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: function () {
            return this.name.match(/^[A-Za-z]+ [A-Za-z]+$/g);
        }
    },
    username: {
        type: String,
        required: true,
        minLength: 5
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    }
});

userSchema.pre('save', async function () {
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

const User = mongoose.model('User', userSchema);

module.exports = User;