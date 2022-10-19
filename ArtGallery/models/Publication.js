const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 6
    },
    paintingTechnique: {
        type: String,
        required: true,
        maxLength: 15
    },
    artPicture: {
        type: String,
        required: true,
        validate: function () {
            return this.artPicture.startsWith('http');
        }
    },
    certificate: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    usersShared: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;