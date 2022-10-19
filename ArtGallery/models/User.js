const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { salt } = require('../config/constants');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    address: {
        type: String,
        required: true,
        maxLength: 20
    },
    publications: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Publication'
        }
    ]
});

userSchema.pre('save', async function(){
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

const User = mongoose.model('User', userSchema);

module.exports = User;