import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MapView = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC0wH-ZaYzuWFEH6n6mhB19bsIZl6bmBmI', // Replace with your Google Maps API key
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [geocodedLocations, setGeocodedLocations] = useState([]);
  const mapRef = useRef();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', etc.
  const user = useSelector((state) => state.user.user);

  // Fetch saved locations from the backend and geocode them
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/garbage/allEntries');
      const locations = response.data;

      // Geocode addresses to get latitude and longitude
      const geocodedData = await Promise.all(
        locations.map(async (loc) => {
          const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
              address: loc.address,
              key: 'AIzaSyC0wH-ZaYzuWFEH6n6mhB19bsIZl6bmBmI', // Replace with your Google Maps API key
            },
          });

          if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return {
              ...loc,
              latitude: lat,
              longitude: lng,
            };
          }

          return loc;
        })
      );

      setGeocodedLocations(geocodedData);
    } catch (err) {
      console.error('Error fetching locations or geocoding:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const entryData = {
      name,
      address,
      quantity,
      category,
      email: user.email,
    };

    try {
      await axios.post('http://localhost:8000/garbage/createEntry', entryData);

      // Show success message
      setSnackbarMessage('Entry added successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Clear the form
      setName('');
      setAddress('');
      setQuantity('');
      setCategory('');

      // Refresh locations to show the new entry on the map
      fetchLocations();
    } catch (err) {
      console.error('Error submitting entry:', err.response ? err.response.data : err.message);

      // Show error message
      setSnackbarMessage('Error adding entry.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Map Section */}
      <Paper className='m-2' elevation={5} sx={{ width: '50%', height: '100vh' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {isLoaded && (
            <GoogleMap
              ref={mapRef}
              center={{ lat: 7.8731, lng: 80.7718 }} // Default to Sri Lanka if no location data
              zoom={geocodedLocations.length ? 8 : 8} // Zoom in if there are saved locations
              mapContainerStyle={{ width: '100%', height: '100%' }}
            >
              {/* Display previously saved locations */}
              {geocodedLocations.map((loc) => (
                <Marker
                  key={loc._id}
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                  onClick={() => setSelectedMarker(loc)}
                >
                  {selectedMarker && selectedMarker._id === loc._id && (
                    <InfoWindow
                      position={{ lat: loc.latitude, lng: loc.longitude }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div>
                        <Typography variant="body1"><strong>Name:</strong> {loc.name}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {loc.email}</Typography>
                        <Typography variant="body1"><strong>Address:</strong> {loc.address}</Typography>
                        <Typography variant="body1"><strong>Latitude:</strong> {loc.latitude}</Typography>
                        <Typography variant="body1"><strong>Longitude:</strong> {loc.longitude}</Typography>
                        <Typography variant="body1"><strong>Quantity:</strong> {loc.quantity}</Typography>
                        <Typography variant="body1"><strong>Category:</strong> {loc.category}</Typography>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          )}
        </div>
      </Paper>

      {/* Form Section */}
      <Paper elevation={10} sx={{ width: '50%', height: '100vh', padding: '20px', borderRadius: 2 }}>
        <Typography variant="h6">Input Details</Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Quantity"
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="plastic">Plastic</MenuItem>
            <MenuItem value="paper">Paper</MenuItem>
            <MenuItem value="metal">Metal</MenuItem>
            <MenuItem value="glass">Glass</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Entry
        </Button>
      </Paper>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MapView;
