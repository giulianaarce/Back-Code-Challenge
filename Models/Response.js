const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    result: Array,
    texto: String
})

const ResponseModel = mongoose.model('moviesApiResponses', responseSchema, 'moviesApiResponses');

module.exports = ResponseModel;