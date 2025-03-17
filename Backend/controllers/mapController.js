const GarbageEntry = require('../models/users/garbageEntry');
const mongoose = require('mongoose');

// Create a new location
const createEntryLocation = async (req, res) => {
    const { name, address, latitude, longitude, quantity, category, email } = req.body;

    const newLocation = new GarbageEntry({
        name,
        address,
        latitude,
        longitude,
        quantity,
        category,
        email
      });
    

    try {
        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        console.error("Error in creating locations", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all location
const getAllEntryLocations = async (req, res) => {
    try {
        const locations = await GarbageEntry.find();
        res.status(200).json(locations);
    } catch (error) {
        console.error("Error in getting all locations", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//find complain by user email(fetching all complains by a user)
const findEntryByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const locations = await GarbageEntry.find({ email: email });
        res.status(200).json(locations);
    } catch (error) {
        console.error("Error in getting all complains by email", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Export all controller functions
module.exports = {
    createEntryLocation,
    getAllEntryLocations,
    findEntryByEmail
};
