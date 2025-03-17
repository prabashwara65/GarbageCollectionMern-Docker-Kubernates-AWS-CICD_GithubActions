const express = require('express');
const VehicleRouter = express.Router();
const VehicleModel = require('../../models/vehicle/VehiclesModel'); 

VehicleRouter.post('/createVehicle', async (req, res) => {
    try {
        const vehicle = new VehicleModel(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        console.error("Error creating vehicle:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

VehicleRouter.get('/vehicles', async (req, res) => {
    try {
        const vehicles = await VehicleModel.find({});
        res.json(vehicles);
    } catch (err) {
        console.error("Error fetching vehicles:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

VehicleRouter.get('/getVehicle/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const vehicle = await VehicleModel.findById(id); // Changed to direct `id` usage
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (err) {
        console.error("Error fetching vehicle:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message }); 
    }
});


VehicleRouter.put('/updateVehicle/:id', (req, res) => {
    const id = req.params.id;

    // Extract fields from the request body with default values
    const {
        vehicleId,
        vehicleNumber,
        vehicleType,
        capacity,
        environment,
        fuelType,
        fuelCapacity,
        insuranceRequirement = {}, // Default to an empty object
        emissionStandard,
        maintenance,
        isAvailable
    } = req.body;

    // Ensure the dates are in the correct format (yyyy-MM-dd)
    const formattedInsuranceRequirement = {
        insuranceStartDate: insuranceRequirement?.insuranceStartDate ? new Date(insuranceRequirement.insuranceStartDate).toISOString().split('T')[0] : null,
        insuranceExpiryDate: insuranceRequirement?.insuranceExpiryDate ? new Date(insuranceRequirement.insuranceExpiryDate).toISOString().split('T')[0] : null,
        insuranceType: insuranceRequirement?.insuranceType || ''
    };

    // Perform the update operation
    VehicleModel.findByIdAndUpdate(
        id,  
        {
            vehicleId,
            vehicleNumber,
            vehicleType,
            capacity,
            environment,
            fuelType,
            fuelCapacity,
            insuranceRequirement: formattedInsuranceRequirement,
            emissionStandard,
            maintenance,
            isAvailable
        },
        { new: true } // Return the updated document
    )
    .then(updatedVehicle => {
        if (!updatedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(updatedVehicle); // Send the updated vehicle document as the response
    })
    .catch(err => {
        console.error("Error updating vehicle:", err);
        res.status(500).json({ error: 'Failed to update vehicle', details: err.message }); // Handle errors
    });
});


VehicleRouter.delete('/deleteVehicle/:id', (req,res) => {
    const id = req.params.id;
    VehicleModel.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))

})

// Update Vehicle Availability
VehicleRouter.put('/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    const { isAvailable } = req.body;
  
    try {
      const vehicle = await VehicleModel.findByIdAndUpdate(id, { isAvailable }, { new: true });
      
      if (!vehicle) {
        return res.status(404).send('Vehicle not found');
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
module.exports = VehicleRouter;





