const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema({
    vehicleId:{type:String, unique: true, required : true },
    vehicleNumber:{type:String, unique: true, required : true },
    date: { type:Date, default: Date.now },
    vehicleType: {type:String, required: true},
    capacity:{type:String, required:true},
    environment: {type:String, required:true},
    fuelType: {type:String, required:true},
    fuelCapacity:{type:String, required:true},
    insuranceRequirement: {
        insuranceStartDate: {type:Date, },
        insuranceExpiryDate : {type:Date, },
        insuranceType: {type:String, }
    },
    emissionStandard: {type:String, enum: ['Pass', 'Fail'], required:true},
    maintenance:String,
    isAvailable: { type: String, enum: ['Available', 'Unavailable'], default: 'Available', required: true }

})

const VehicleModel = mongoose.model("vehicles", VehicleSchema)
module.exports = VehicleModel