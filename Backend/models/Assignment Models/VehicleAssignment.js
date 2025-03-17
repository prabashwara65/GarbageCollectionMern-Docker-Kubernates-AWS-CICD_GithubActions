const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique record IDs

const vehicleAssignmentSchema = new mongoose.Schema({
    vehicleRecordID: { type: String, default: uuidv4, unique: true }, // Unique record ID,
    vehicleId: { type: String, required: true },
    vehicleNumber:{type:String, required : true },
    vehicleType: {type:String, required: true},
    area:{type:String, required: true},
    dateAssigned: { type: Date, default: Date.now },
    isComplete: { type: Boolean, default: false },  
});

const VehicleAssignment = mongoose.model('VehicleAssignment', vehicleAssignmentSchema);
module.exports = VehicleAssignment;