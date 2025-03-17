//userregmodel.js
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    
    name: String,
    email: String,
    area: String,
    phone: Number,
    password: String,
    iscollected: String,

    role: {
        type: String,
        value: "Guest"
    }
})

const userModel = mongoose.model('User' , userSchema)

module.exports = userModel;