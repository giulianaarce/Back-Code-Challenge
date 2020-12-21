const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    fecha: String,
    texto: String,
    responseFrom:String
})

const SearchModel = mongoose.model('requestLogs', searchSchema, 'requestLogs');

module.exports = SearchModel;