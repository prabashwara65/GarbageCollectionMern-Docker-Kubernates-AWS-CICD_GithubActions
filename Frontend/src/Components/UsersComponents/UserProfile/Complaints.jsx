import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.user);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Editable state
  const [isEditing, setIsEditing] = useState(false);
  const [editableComplaint, setEditableComplaint] = useState({});
  const [formErrors, setFormErrors] = useState({}); // To hold validation errors

  useEffect(() => {
    axios
      .get(`http://localhost:8000/complain/findComplainByEmail/${user.email}`)
      .then((res) => setComplaints(res.data))
      .catch((err) => {
        console.log(err);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to fetch complaints.');
        setSnackbarOpen(true);
      });
  }, [user.email]);

  const handleClickOpen = (complaint) => {
    setSelectedComplaint(complaint);
    setEditableComplaint({
      ...complaint,
      complain: complaint.complain,
      email: complaint.email,
      phone: complaint.phone || ''
    });
    setOpen(true);
    setIsEditing(false);
    setFormErrors({}); // Reset errors
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const handleDelete = (complaintId) => {
    axios
      .delete(`http://localhost:8000/complain/deleteComplain/${complaintId}`)
      .then((res) => {
        setComplaints((prevComplaints) =>
          prevComplaints.filter((complaint) => complaint._id !== complaintId)
        );
        setSnackbarSeverity('success');
        setSnackbarMessage('Complaint deleted successfully.');
        setSnackbarOpen(true);
        handleClose();
      })
      .catch((err) => {
        console.log('Error deleting complaint:', err);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to delete complaint.');
        setSnackbarOpen(true);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableComplaint((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    // Email validation
    if (!editableComplaint.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editableComplaint.email)) {
      errors.email = 'Email is not valid';
    }

    // Complaint validation
    if (!editableComplaint.complain) {
      errors.complain = 'Complaint is required';
    }

    // Phone validation (if provided)
    if (editableComplaint.phone && isNaN(editableComplaint.phone)) {
      errors.phone = 'Phone number must be numeric';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // return true if no errors
  };

  const handleSave = () => {
    if (!validateForm()) {
      return; // Exit if validation fails
    }
    axios
      .put(`http://localhost:8000/complain/updateComplain/${selectedComplaint._id}`, editableComplaint)
      .then((res) => {
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === selectedComplaint._id ? { ...complaint, ...editableComplaint } : complaint
          )
        );
        setSnackbarSeverity('success');
        setSnackbarMessage('Complaint updated successfully.');
        setSnackbarOpen(true);
        handleClose();
      })
      .catch((err) => {
        console.log('Error updating complaint:', err);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to update complaint.');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-2">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Complaints</h2>
      {complaints.length === 0 ? (
        <p className="text-gray-600">No complaints posted yet.</p>
      ) : (
        <Grid container spacing={2} 
        style={
          { 
            maxHeight: '450px', // Set a maximum height for the scrollable area
            overflowY: 'auto', // Enable vertical scrolling
          }
        }
        >
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} md={4} key={complaint._id}>
              <div
                onClick={() => handleClickOpen(complaint)}
                className={`p-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 ${
                  complaint.status === "0" ? "bg-red-100" : "bg-gray-50"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800">Complaint ID: {complaint._id}</h3>
                <p className="mt-2 text-gray-600">Status: {complaint.status === "0" ? "pending" : "approved"}</p>
                <p className="mt-2 text-gray-500 text-sm">
                  Posted on: {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for Complaint Details */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { 
            width: '500px',   
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Complaint Details
          {selectedComplaint && (
            <>
              {selectedComplaint.status === "0" && (
                <IconButton
                  aria-label="edit"
                  onClick={handleEdit}
                  style={{ float: 'right' }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              )}
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(selectedComplaint._id)}
                style={{ float: 'right' }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </DialogTitle>
        {selectedComplaint && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <h3 className="text-lg font-semibold">
                Complaint Name: {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={editableComplaint.name}
                    disabled
                  />
                ) : (
                  selectedComplaint.name
                )}
              </h3>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Email"
                name="email"
                value={editableComplaint.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Complaint"
                name="complain"
                value={editableComplaint.complain}
                onChange={handleInputChange}
                error={!!formErrors.complain}
                helperText={formErrors.complain}
                disabled={!isEditing}
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Phone"
                name="phone"
                value={editableComplaint.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={!isEditing}
              />
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} color="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning here
        >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
    </Snackbar>
    </div>
  );
};

export default Complaints;
