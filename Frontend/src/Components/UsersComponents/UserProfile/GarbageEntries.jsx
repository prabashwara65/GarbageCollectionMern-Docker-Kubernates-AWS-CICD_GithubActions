import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Grid, Paper, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert } from '@mui/material';

const GarbageEntries = () => {
  const [entries, setEntries] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', etc.
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Fetch the garbage entries
    axios.get(`http://localhost:8000/garbage/allEntries/${user.email}`)
      .then(res => setEntries(res.data))
      .catch(err => console.log(err));
  }, [user.email]);

  // Function to delete an entry
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/garbage/deleteEntry/${id}`)
      .then((res) => {
        setSnackbarMessage('Entry deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setEntries(entries.filter(entry => entry._id !== id)); // Remove deleted entry from state
      })
      .catch((err) => {
        setSnackbarMessage('Error deleting entry.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  // Placeholder for handling update (you can extend this to open a modal or navigate to an update form)
  const handleUpdate = (id) => {
    console.log(`Update entry with ID: ${id}`);
    // You can open a modal here or redirect to a separate update form
  };

  // Snackbar Close Function
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Grid item xs={12} md={6} mt={2}>
        <Paper elevation={5} sx={{ borderRadius: 2, padding: '20px' }}>
          <Typography variant="h6">Your Garbage Entries</Typography>

          {/* Scrollable Table Section */}
          {entries.length === 0 ? (
            <p>No garbage entries found.</p>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>  {/* Set max height for scroll */}
              <Table stickyHeader aria-label="sticky table">  {/* Add sticky header for a better UX */}
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.address}</TableCell>
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {/* Update and Delete Buttons */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdate(entry._id)}
                          style={{ marginRight: '10px' }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(entry._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>

      {/* Snackbar for Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GarbageEntries;
