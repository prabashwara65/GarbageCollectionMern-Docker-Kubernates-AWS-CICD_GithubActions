const express = require('express');
const {
    createEntryLocation,
    getAllEntryLocations,
    findEntryByEmail
} = require('../../controllers/mapController');


const mapRouter = express.Router();

// Route to create a new complaint
mapRouter.post("/createEntry", createEntryLocation);

// Route to get all complaints
mapRouter.get("/allEntries", getAllEntryLocations);

//rooute to get all complains by email
mapRouter.get("/allEntries/:email", findEntryByEmail);


module.exports = mapRouter;
