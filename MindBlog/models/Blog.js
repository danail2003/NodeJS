const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    image: {
        type: String,
        required: true,
        validate: function(){
            return this.image.startsWith('http');
        }
    },
    content: {
        type: String,
        required: true,
        minLength: 10
    },
    blogCategory: {
        type: String,
        required: true,
        minLength: 3
    },
    followList: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;