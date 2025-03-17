const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const userModel = require('../../models/users/userRegister');

app.post('/register', (req, res) => {
    const { name, email, area , phone ,  password , iscollected } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            userModel.create({ name, email, area , phone , password: hash , iscollected })
                .then(user => res.json("Success"))
                .catch(err => res.json({ err }))
        }).catch(err => res.json({ err }))
});

app.get("/ViewUsers" , (req , res) => {
    userModel.find({})
    .then(buyer => res.json(buyer))
    .catch(err => {
        console.error(err)
        res.status(500).json({error : " view buyer has erros"})
    })
})


app.get('/ViewUsers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const buyer = await userModel.findById(id); // Changed to direct `id` usage
        if (!buyer) {
            return res.status(404).json({ error: "buyer not found" });
        }
        res.json(buyer);
    } catch (err) {
        console.error("Error fetching buyer:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message }); 
    }
});

app.put('/UpdateUsers/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedBuyer = await userModel.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                iscollected: req.body.iscollected,
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

// In your server code (Node.js/Express)
app.put('/reset-collection-status', async (req, res) => {
    try {
      await userModel.updateMany({}, { iscollected: 'not_collected' });
      res.status(200).send('All statuses updated to not_collected');
    } catch (error) {
      console.error('Error updating collection statuses:', error);
      res.status(500).send('Failed to update collection statuses');
    }
  });

module.exports = app;
