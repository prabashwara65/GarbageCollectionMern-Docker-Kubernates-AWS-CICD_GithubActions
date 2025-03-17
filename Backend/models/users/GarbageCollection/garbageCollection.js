//Garbagemodel.js
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    
    name: String,
    email: String,
    phone: Number,
    password: String,
    iscollected: String,

})

const userModel = mongoose.model('GarbageCollection' , userSchema)

module.exports = userModel;