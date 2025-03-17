const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/users/userRegister');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        // Update loggedIn status
                        user.loggedIn = true;
                        user.save() // Save the updated user record
                            .then(() => {
                                const token = jwt.sign({ 
                                    email: user.email, 
                                    role: user.role,
                                    name: user.name, 
                                    id: user._id 
                                }, "jwt-secret-key", { expiresIn: '1d' });

                                res.cookie('token', token, { httpOnly: true }); // Set cookie with token
                                return res.json({ 
                                    Status: "Success", 
                                    role: user.role,
                                    name: user.name,
                                    email: user.email,
                                    loggedIn: user.loggedIn 
                                });
                            })
                            .catch(err => res.status(500).json({ error: "Error updating user record" }));
                    } else {
                        return res.json({ Status: "Failure", message: "Password is incorrect" });
                    }
                });
            } else {
                return res.json({ Status: "Failure", message: "No record found" });
            }
        })
        .catch(err => res.status(500).json({ error: "Database error" }));
});

module.exports = router;
