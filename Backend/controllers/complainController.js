const Complain = require('../models/users/complain');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs'); // Assuming you're using ejs as the templating engine
const puppeteer = require('puppeteer');
//const template = require('../../Frontend/src/templates/reportTemplate.ejs');

// Create a new complaint
const createComplain = async (req, res) => {
    const complain = req.body;

    if (!complain.name || !complain.email || !complain.phone || !complain.complain) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newComplain = new Complain(complain);

    try {
        await newComplain.save();
        res.status(201).json(newComplain);
    } catch (error) {
        console.error("Error in creating complain", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all complaints
const getAllComplains = async (req, res) => {
    try {
        const complains = await Complain.find();
        res.status(200).json(complains);
    } catch (error) {
        console.error("Error in getting all complains", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get a complaint by ID
const getComplainById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid complain id" });
    }

    try {
        const complain = await Complain.findById(id);
        res.status(200).json(complain);
    } catch (error) {
        console.error("Error in fetching the complain", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update a complaint
const updateComplain = async (req, res) => {
    const { id } = req.params;
    const complain = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid complain id" });
    }

    try {
        const updatedComplain = await Complain.findByIdAndUpdate(id, complain, { new: true });
        res.status(200).json(updatedComplain);
    } catch (error) {
        console.error("Error in updating the complain", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update the status of a complaint
const updateComplainStatus = async (req, res) => {
    const { id } = req.params; // Get complaint ID from request parameters
    const { status } = req.body; // Get the new status from the request body

    // Validate the complaint ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid complain id" });
    }

    // Validate the status
    if (!status || (status !== "0" && status !== "1")) {
        return res.status(400).json({ success: false, message: "Status must be 'pending' or 'solved'" });
    }

    try {
        const updatedComplain = await Complain.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!updatedComplain) {
            return res.status(404).json({ success: false, message: "Complain not found" });
        }
        res.status(200).json(updatedComplain);
    } catch (error) {
        console.error("Error in updating the complain status", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// Delete a complaint
const deleteComplain = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid complain id" });
    }

    try {
        await Complain.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Complain deleted successfully" });
    } catch (error) {
        console.error("Error in deleting the complain", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//find complain by user email(fetching all complains by a user)
const findComplainByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const complains = await Complain.find({ email: email }).sort({status: -1});
        res.status(200).json(complains);
    } catch (error) {
        console.error("Error in getting all complains by email", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// New function to get the count of all complaints
const getCountAllComplaints = async (req, res) => {
    try {
      const count = await Complain.countDocuments(); // Count all complaints in the DB
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error counting complaints' });
    }
};

// New function to get the count of approved complaints
const getCountStatusApproved = async (req, res) => {
    try {
      const count = await Complain.countDocuments({ status: "1" }); // Count complaints with approved status
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error counting approved complaints' });
    }
};

// New function to get the count of pending complaints
const getCountStatusPending = async (req, res) => {
    try {
      const count = await Complain.countDocuments({ status: "0" }); // Count complaints with pending status
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error counting pending complaints' });
    }
};

// New function to generate a report
const generateReport = async (req, res) => {
    try {
      // Fetching all complaints
      const complaints = await Complain.find().sort({ status: -1 });
      
      // Counting complaints
      const totalCount = await Complain.countDocuments();
      const approvedCount = await Complain.countDocuments({ status: "1" });
      const pendingCount = await Complain.countDocuments({ status: "0" });
      
      // Load the HTML template
      const templatePath = path.resolve(__dirname, '../../Frontend/src/templates/complaintReportTemplate.ejs'); // Adjust the path if necessary
      const template = fs.readFileSync(templatePath, 'utf-8');
      
      // Render the template with the fetched data
      const reportHTML = ejs.render(template, {
        complaints,
        totalCount,
        approvedCount,
        pendingCount
      });
  
      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true, // Ensure Puppeteer is running in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Fix potential permission issues
      });
      const page = await browser.newPage();
  
      // Load the rendered HTML into Puppeteer
      await page.goto(`data:text/html;charset=UTF-8,${encodeURIComponent(reportHTML)}`, {
        waitUntil: 'networkidle0' // Ensures the page is fully loaded before generating the PDF
      });
  
      // Create the PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true // Ensures background styles are printed in the PDF
      });
  
      await browser.close();
  
      // Set headers for PDF download
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=complaints_report.pdf',
        'Content-Length': pdfBuffer.length // Ensure Content-Length is set for the buffer
      });
  
      // Send the PDF to the frontend
      res.end(pdfBuffer); // Send the binary buffer
    } catch (error) {
      res.status(500).json({
        message: 'Error generating report',
        error: error.message
      });
    }
  };



// Export all controller functions
module.exports = {
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
};
