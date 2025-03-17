const mongoose = require('mongoose');

const garbageEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    // latitude: {
    //     type: Number,
    //     required: true
    // },
    // longitude: {
    //     type: Number,
    //     required: true
    // },
    quantity: {
        type: Number, // or String, depending on how you want to store quantity
        required: true
    },
    category: {
        type: String,
        enum: ['plastic', 'paper', 'metal', 'glass'], // Enum for predefined categories
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const GarbageEntry = mongoose.model('GarbageEntry', garbageEntrySchema);
module.exports = GarbageEntry;
