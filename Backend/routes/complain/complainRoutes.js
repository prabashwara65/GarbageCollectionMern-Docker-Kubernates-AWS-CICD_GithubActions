const express = require('express');
const {
    createComplain,
    getAllComplains,
    getComplainById,
    updateComplain,
    deleteComplain,
    findComplainByEmail,
    updateComplainStatus,
    getCountAllComplaints,
    getCountStatusApproved,
    getCountStatusPending,
    generateReport
} = require('../../controllers/complainController');


const complainRouter = express.Router();

// Route to create a new complaint
complainRouter.post("/createComplain", createComplain);

// Route to get all complaints
complainRouter.get("/allComplains", getAllComplains);

// Route to get a complaint by ID
complainRouter.get("/complain/:id", getComplainById);

// Route to update a complaint
complainRouter.put("/updateComplain/:id", updateComplain);//status update, not for user

complainRouter.put("/updateComplainStatus/:id", updateComplainStatus);//status update, not for user

// Route to delete a complaint
complainRouter.delete("/deleteComplain/:id", deleteComplain);

// Route to find complaints by email (complains made by a specific user)
complainRouter.get("/findComplainByEmail/:email", findComplainByEmail);


// Router to get the count of all complaints
complainRouter.get("/countAllComplaints", getCountAllComplaints);

// Router to get the count of approved complaints
complainRouter.get("/countStatusApproved", getCountStatusApproved);

// Router to get the count of pending complaints
complainRouter.get("/countStatusPending", getCountStatusPending);

// Router to generate a report
complainRouter.get("/generateReport", generateReport);


module.exports = complainRouter;
