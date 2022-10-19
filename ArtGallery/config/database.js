const mongoose = require('mongoose');
const { CONN_STRING } = require('./connString');

exports.initializeDb = () => mongoose.connect(CONN_STRING);