const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    complain: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "0" // 0 for "Pending", you can change it later to other values for "In Progress", "Completed", etc.
    }
}, {
    timestamps: true
});

const Complain = mongoose.model('Complain', complainSchema);
module.exports = Complain;
