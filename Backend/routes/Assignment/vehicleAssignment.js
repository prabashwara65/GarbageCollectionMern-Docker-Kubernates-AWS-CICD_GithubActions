const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const VehicleAssignment = require('../../models/Assignment Models/VehicleAssignment');

//create new vehicle assignment
router.post('/assign', async(req,res) => {
    const{vehicleId, vehicleNumber, vehicleType,area} = req.body;

    try{
        const newAssignment = new VehicleAssignment({
            vehicleId,
            vehicleNumber,
            vehicleType,
            area
        });

        await newAssignment.save();
        res.status(201).json({ message: 'Vehicle assigned successfully', assignment: newAssignment });
    }catch (error) {
        res.status(500).json({ message: 'Failed to assign vehicle', error });
    }
});

// Get the last vehicle assignment based on vehicleId and area
router.get('/vehicleAssignments', async (req, res) => {
    const { vehicleId, area } = req.query;
    try {
      const assignments = await VehicleAssignment.find({ vehicleId, area })
        .sort({ createdAt: -1 }) // Sort by the most recent first
        .limit(1); // Get the last assignment
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update vehicle assignment to mark as complete
router.put('/vehicleAssignments/:id', async (req, res) => {
    const assignmentId = req.params.id; // Extract the ID from the URL params
  
    // Check if the ID is valid (a proper ObjectId)
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: 'Invalid assignment ID' });
    }
  
    try {
      // Find the assignment by its ID and update the isComplete field to true
      const updatedAssignment = await VehicleAssignment.findByIdAndUpdate(
        assignmentId,
        { isComplete: true },
        { new: true } // Return the updated document
      );
  
      // If no assignment is found, send a 404 response
      if (!updatedAssignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      // Successfully updated, send the updated document as a response
      res.status(200).json(updatedAssignment);
    } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

router.get('/assignall', async (req, res) => {
    try {
        const assignments = await VehicleAssignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignments', error });
    }
});



module.exports = router;