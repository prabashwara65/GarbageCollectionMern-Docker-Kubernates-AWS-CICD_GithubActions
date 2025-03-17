const express = require('express');
const router = express.Router();
const User = require('../../../models/users/userRegister'); 
const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

// Route to send a confirmation email
router.post('/send-confirmation', async (req, res) => {
  const { email, _id } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    console.log("Sending email to:", email);
    if (!user) return res.status(400).json({ error: "User doesn't exist" });

    // // Generate a token for confirmation
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    const confirmationUrl = `http://localhost:5173/GetConfirmUpdate/${_id}`;

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Garbage Truck Confirmation',
      html: `<h1>Garbage Truck Confirmation</h1><p>Please click the following link to confirm: <a href="${confirmationUrl}">Confirm</a></p>`,
    });

    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// Route to send a notification email
router.post('/send-notification', async (req, res) => {
  const { email, _id, message } = req.body;
  try {
    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Garbage Truck Notification',
      html: `<h1>Notification</h1><p>${message}</p>`,
    });

    res.status(200).json({ message: 'Notification email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification email' });
  }

});




module.exports = router;
