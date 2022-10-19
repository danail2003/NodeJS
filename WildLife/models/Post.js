const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 6
    },
    keyword: {
        type: String,
        required: true,
        minLength: 6
    },
    location: {
        type: String,
        required: true,
        maxLength: 15
    },
    date: {
        type: String,
        required: true,
        validate: function () {
            return this.date.match(/^\d{2}.\d{2}.\d{4}$/g)
        }
    },
    image: {
        type: String,
        required: true,
        validate: function () {
            return this.image.startsWith('http');
        }
    },
    description: {
        type: String,
        required: true,
        minLength: 8
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    votes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;