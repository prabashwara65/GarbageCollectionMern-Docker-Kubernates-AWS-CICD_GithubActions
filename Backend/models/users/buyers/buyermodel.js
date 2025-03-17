//buyermodel.js
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    
    name: String,
    email: String,
    phone: Number,
    password: String,

})

const userModel = mongoose.model('Buyer' , userSchema)

module.exports = userModel;