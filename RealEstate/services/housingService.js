const Housing = require('../models/Housing');

exports.create = async (data) => await Housing.create(data);

exports.getLatestOffers = async () => await Housing.find().sort({ _id: -1 }).limit(3).lean();

exports.getAll = async () => await Housing.find().lean();

exports.getById = async (id) => await Housing.findById(id).populate('rentedAHome').lean();

exports.getByIdWithoutLean = async (id) => await Housing.findById(id);

exports.delete = async (id) => await Housing.findByIdAndDelete(id);

exports.editById = async (id, data) => await Housing.findByIdAndUpdate(id, data);

exports.search = async (type) => await Housing.find({ type }).lean();