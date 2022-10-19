const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 6
    },
    type: {
        type: String,
        required: true,
        enum: ['Apartment', 'Villa', 'House']
    },
    year: {
        type: Number,
        required: true,
        validate: function () {
            return this.year >= 1850 && this.year <= 2021
        }
    },
    city: {
        type: String,
        required: true,
        minLength: 4
    },
    homeImage: {
        type: String,
        required: true,
        validate: function () {
            return this.homeImage.startsWith('http');
        }
    },
    propertyDescription: {
        type: String,
        required: true,
        maxLength: 60
    },
    availablePieces: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    rentedAHome: [
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

const Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;