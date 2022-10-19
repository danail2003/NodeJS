const Publication = require('../models/Publication');

exports.create = (data) => Publication.create(data);

exports.getAll =() => Publication.find();

exports.getOne = (id) => Publication.findById(id).populate('author');

exports.delete = (id) => Publication.findByIdAndDelete(id);

exports.edit = (id, data) => Publication.findByIdAndUpdate(id, data);
