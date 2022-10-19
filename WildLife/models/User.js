const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        requred: true,
        minLength: 3
    },
    lastName: {
        type: String,
        requred: true,
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        validate: function () {
            return this.email.match(/^[a-z]+@[a-z]+.[a-z]+$/g);
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    myPosts: [
        {
           type: mongoose.Types.ObjectId,
           ref: 'Post'
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;