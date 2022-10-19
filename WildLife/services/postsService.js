const Post = require('../models/Post');

exports.create = async (data) => await Post.create(data);

exports.getAllLeaned = async () => await Post.find().lean();

exports.getByIdLeaned = async (id) => await Post.findById(id).populate('author').populate('votes').lean();

exports.getById = async (id) => await Post.findById(id);

exports.delete = async (id) => await Post.findByIdAndDelete(id);

exports.edit = async (id, data) => await Post.findByIdAndUpdate(id, data);