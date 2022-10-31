const Blog = require('../models/Blog');

exports.create = async (data) => await Blog.create(data);

exports.getAllLeaned = async () => await Blog.find().lean();

exports.getByIdWithOwnerLeaned = async (id) => await Blog.findById(id).populate('followList').populate('owner').lean();

exports.getByIdLeaned = async (id) => await Blog.findById(id).lean();

exports.getById = async (id) => await Blog.findById(id);

exports.delete = async (id) => await Blog.findByIdAndDelete(id);

exports.edit = async (id, data) => await Blog.findByIdAndUpdate(id, data);

exports.getLastThree = async () => await Blog.find().sort({ _id: -1 }).limit(3).lean();
