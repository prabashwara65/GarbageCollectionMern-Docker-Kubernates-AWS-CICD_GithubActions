const express = require('express');
const GarbageCollectionRoute = express.Router();
const GarbageCollectionModel = require('../../../models/users/GarbageCollection/garbageCollection')


//Route for create CreateGarbageColletion
GarbageCollectionRoute.post("/CreateGarbageCollection" , (req , res) => {
    GarbageCollectionModel.create(req.body)
    .then(GarbageCollection => res.json(GarbageCollection))
    .catch(err => {
        console.error(err);
        res.status(500).json({error : " internal server error "})
    })  
});

//Route for View CreateGarbageColletion
GarbageCollectionRoute.get("/ViewGarbageCollection" , (req , res) => {
    GarbageCollectionModel.find({})
    .then(GarbageCollection => res.json(GarbageCollection))
    .catch(err => {
        console.error(err)
        res.status(500).json({error : " View GarbageColletion has erros"})
    })
});

//Route for send id for Update CreateGarbageColletion
GarbageCollectionRoute.get('/ViewGarbageCollection/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const GarbageCollection = await GarbageCollectionModel.findById(id); 
        if (!GarbageCollection) {
            return res.status(404).json({ error: "buyer not found" });
        }
        res.json(GarbageCollection);
    } catch (err) {
        console.error("Error fetching buyer:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message }); 
    }
});

//Route for Update CreateGarbageColletion
GarbageCollectionRoute.put('/UpdateGarbageCollection/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const UpdateGarbageCollectionModel = await GarbageCollectionModel.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                model: req.body.email,
                millage: req.body.phone,
                availability: req.body.password,
                iscollected: req.body.iscollected,
            },
            { new: true } 
        );

        res.json(UpdateGarbageCollectionModel);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Route for Delete CreateGarbageColletion record
GarbageCollectionRoute.delete('/DeleteGarbageCollection/:id', (req,res) => {
    const id = req.params.id;
    GarbageCollectionModel.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))

})


module.exports = GarbageCollectionRoute;