const mongoose = require('mongoose')

const DriverSchema = new mongoose.Schema({
    employeeId: { type: String, unique: true, required: true },
    name: {
        firstName: { type: String },
        lastName: { type: String },
    },
    dateOfBirth: { type: Date, required: true },
    nic: { type: String, unique: true, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: {
        no: { type: String },
        street: { type: String },
        city: { type: String }
    },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    licenseRequirements: {
        licenseNumber: { type: String },
        licenseExpiryDate: { type: Date }
    },
    position: { type: String, required: true },
    hiredDate: { type: Date, required: true },
    status: { type: String, enum: ["Full-Time", 'Contract'], required: true },
    isAvailable: { type: String, enum: ['Available', 'Unavailable'], default: 'Available', required: true },
})

const DriverModel = mongoose.model("drivers", DriverSchema)
module.exports = DriverModel
