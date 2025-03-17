const express = require('express');
const mongoose = require('mongoose');
const driverAssignmentRouter = express.Router();
const DriverAssignment = require('../../models/Assignment Models/DriverAssignmentModel');

//create a new driver assignment
driverAssignmentRouter. post('/assignDriver', async (req,res) => {
    try {
        const{employeeId, name, position, area} = req.body;

        const newAssignmet = new DriverAssignment ({
            employeeId,
            name ,
            position,
            area
        });

        await newAssignmet.save();
        res.status(200).json(newAssignmet); 
    } catch (error) {
        console.error("Error creating driver assignment : ", error);
        res.status(500).json({error:"Failed to create driver assignment"});
    }
})

//Fetch all assigned drivers
driverAssignmentRouter.get('/assignments' , async (req, res) => {
    try {
        const assignment = await DriverAssignment.find();
        res.status(200).json(assignment);
    } catch (error) {
        console.error("Error fetching driver assignments:", error);
        res.status(500).json({ error: "Failed to fetch driver assignments" });
    }
});

//last assignment entry based on employeeID and area
driverAssignmentRouter.get('/driverAssignments', async (req, res) => {
    const { employeeId, area } = req.query;
    try {
      const assignments = await DriverAssignment.find({ employeeId, area })
        .sort({ createdAt: -1 }) // Sort by the most recent first
        .limit(1); // Get the last assignment
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update driver assignment to mark as complete
driverAssignmentRouter.put('/driverAssignments/:id', async (req, res) => {
  const assignmentId = req.params.id; // Extract the ID from the URL params

  // Check if the ID is valid (a proper ObjectId)
  if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
    return res.status(400).json({ message: 'Invalid assignment ID' });
  }

  try {
    // Find the assignment by its ID and update the isComplete field to true
    const updatedAssignment = await DriverAssignment.findByIdAndUpdate(
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
    // Handle any errors that occur during the update
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = driverAssignmentRouter;