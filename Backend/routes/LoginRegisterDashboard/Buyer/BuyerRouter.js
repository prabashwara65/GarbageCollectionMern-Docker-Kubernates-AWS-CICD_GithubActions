const express = require('express');
const BuyerRouter = express.Router();
const BuyerModel = require('../../../models/users/buyers/buyermodel')

BuyerRouter.post("/CreateBuyer" , (req , res) => {
    BuyerModel.create(req.body)
    .then(buyer => res.json(buyer))
    .catch(err => {
        console.error(err);
        res.status(500).json({error : " internal server error "})
    })  
});

BuyerRouter.get("/ViewBuyers" , (req , res) => {
    BuyerModel.find({})
    .then(buyer => res.json(buyer)) 
    .catch(err => {
        console.error(err)
        res.status(500).json({error : " view buyer has erros"})
    })
})

BuyerRouter.get('/ViewBuyers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const buyer = await BuyerModel.findById(id); // Changed to direct `id` usage
        if (!buyer) {
            return res.status(404).json({ error: "buyer not found" });
        }
        res.json(buyer);
    } catch (err) {
        console.error("Error fetching buyer:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message }); 
    }
});

BuyerRouter.put('/BuyerUpdate/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedBuyer = await BuyerModel.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                model: req.body.email,
                millage: req.body.phone,
                availability: req.body.password
            },
            { new: true } 
        );

        res.json(updatedBuyer);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


BuyerRouter.delete('/BuyerDelete/:id', (req,res) => {
    const id = req.params.id;
    BuyerModel.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))

})


module.exports = BuyerRouter;