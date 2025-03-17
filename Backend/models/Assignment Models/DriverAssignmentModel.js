const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique record IDs

const DriverAssignmentSchema = new mongoose.Schema({
    driverRecordID: { type: String, default: uuidv4, unique: true }, // Unique record ID,
    employeeId: { type: String, required: true },
    name: {
        firstName: { type: String },
        lastName: { type: String },
    },
    position: { type: String },
    area:{type:String, required: true},
    dateAssigned: { type: Date, default: Date.now },
    isComplete: { type: Boolean, default: false },  
});

const DriverAssignment = mongoose.model('DriverAssignment', DriverAssignmentSchema);
module.exports = DriverAssignment;