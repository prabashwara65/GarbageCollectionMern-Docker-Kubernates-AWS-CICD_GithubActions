const express = require('express');
const DriverRouter = express.Router();
const DriverModel = require("../../models/Drivers/DriversModel")

DriverRouter.post('/createDriver', async (req, res) => {
    try {
        const driver = new DriverModel(req.body);
        await driver.save();
        res.status(201).json(driver);
    } catch (err) {
        console.error("Error creating driver:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

DriverRouter.get('/drivers', async (req, res) => {
    try {
        const drivers = await DriverModel.find({});
        res.json(drivers);
    } catch (err) {
        console.error("Error fetching drivers:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

DriverRouter.get('/getDriver/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const driver = await DriverModel.findById(id); // Changed to direct `id` usage
        if (!driver) {
            return res.status(404).json({ error: "driver not found" });
        }
        res.json(driver);
    } catch (err) {
        console.error("Error fetching driver:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message }); 
    }
});

// Route to update a driver by ID
DriverRouter.put('/updateDriver/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Extract fields from the request body
        const {
            name,
            dateOfBirth,
            nic,
            gender,
            address,
            phoneNumber,
            email,
            licenseRequirements,
            position,
            hiredDate,
            status,
            isAvailable
        } = req.body;

       
        // Perform the update operation
        const updatedDriver = await DriverModel.findByIdAndUpdate(
            id,
            {
                name,
                dateOfBirth,
                nic,
                gender,
                address,
                phoneNumber,
                email,
                licenseRequirements,
                position,
                hiredDate,
                status,
                isAvailable
            },
            { new: true } // Return the updated document
        );

        if (!updatedDriver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(updatedDriver); // Send the updated driver document as the response
    } catch (err) {
        console.error("Error updating driver:", err);
        res.status(500).json({ error: 'Failed to update driver', details: err.message }); // Handle errors
    }
});

DriverRouter.delete('/deleteDriver/:id', (req,res) => {
    const id = req.params.id;
    DriverModel.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))

})

// Update Driver Availability
DriverRouter.put('/drivers/:id', async (req, res) => {
    const { id } = req.params;
    const { isAvailable } = req.body;
  
    try {
      const driver = await DriverModel.findByIdAndUpdate(id, { isAvailable }, { new: true });
      
      if (!driver) {
        return res.status(404).send('driver not found');
      }
      
      res.json(driver);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


module.exports = DriverRouter;