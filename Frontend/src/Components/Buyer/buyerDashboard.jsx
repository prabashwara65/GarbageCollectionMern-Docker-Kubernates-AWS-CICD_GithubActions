import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Drawer, List, ListItem, ListItemText, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BuyerDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [geocodedLocations, setGeocodedLocations] = useState([]);
  const [selectedPage, setSelectedPage] = useState('Waste Listings');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickupData, setPickupData] = useState({
    pickupDate: '',
    pickupTime: '',
    quantity: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for the Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const buyer = useSelector((state) => state.user.user);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDsDH2Ozs-ReKbNBHAEMsNxRP2Yng2ZUKc',
  });
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    if (selectedPage === 'Waste Listings') {
      axios.get('http://localhost:4000/garbage/allEntries')
        .then((res) => {
          setEntries(res.data);
          geocodeLocations(res.data);
        })
        .catch((err) => {
          console.error('Error fetching garbage entries:', err);
        });
    }
  }, [selectedPage]);

  const geocodeLocations = async (locations) => {
    const geocodedData = await Promise.all(
      locations.map(async (loc) => {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: loc.address,
            key: 'AIzaSyDsDH2Ozs-ReKbNBHAEMsNxRP2Yng2ZUKc',
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
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleView = (entry) => {
    const marker = geocodedLocations.find(loc => loc._id === entry._id);
    setSelectedMarker(marker);
    mapContainerRef.current.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      if (mapRef.current && marker) {
        mapRef.current.panTo({ lat: marker.latitude, lng: marker.longitude });
        mapRef.current.setZoom(15);
      }
    }, 500);
  };

  const calculateRoute = (marker) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
          origin: { lat: userLat, lng: userLng },
          destination: { lat: marker.latitude, lng: marker.longitude },
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(result);
        setTravelTime(result.routes[0].legs[0].duration.text);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleBuy = (marker) => {
    setSelectedMarker(marker);
    setDialogOpen(true);
  };

  // Handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/garbage/scheduleEntry', {
        ...pickupData,
        locationId: selectedMarker._id,
        buyerId: buyer._id,
      });
      console.log('Pickup scheduled:', response.data);
      setSnackbarMessage('Pickup scheduled successfully!'); // Set success message
      setSnackbarOpen(true); // Open Snackbar
      setDialogOpen(false); // Close the dialog after submission
      setPickupData({ pickupDate: '', pickupTime: '', quantity: '' }); // Reset form data
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      setSnackbarMessage('Failed to schedule pickup. Please try again.'); // Set error message
      setSnackbarOpen(true); // Open Snackbar
    }
  };

  // Close the Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderPageContent = () => {
    if (selectedPage === 'Waste Listings') {
      return (
        <Box sx={{ padding: '75px' }}>
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            Garbage Entries
          </Typography>
          {entries.length === 0 ? (
            <Typography>No garbage entries found.</Typography>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto', borderRadius: 2 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleView(entry)} 
                            sx={{ fontSize: '0.875rem', textTransform: 'none' }} 
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box ref={mapContainerRef} sx={{ height: 400, marginTop: 3 }}>
                {isLoaded && (
                  <GoogleMap
                    onLoad={(map) => (mapRef.current = map)}
                    center={{ lat: 7.8731, lng: 80.7718 }}
                    zoom={geocodedLocations.length ? 8 : 8}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                  >
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
                              <Typography variant="body1"><strong>Address:</strong> {loc.address}</Typography>
                              <Typography variant="body1"><strong>Quantity:</strong> {loc.quantity}</Typography>
                              <Typography variant="body1"><strong>Category:</strong> {loc.category}</Typography>
                              
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => calculateRoute(loc)}
                                sx={{ marginTop: 1, marginRight: 1 }}
                              >
                                Calculate Route
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBuy(loc)}
                                sx={{ marginTop: 1 }}
                              >
                                Buy
                              </Button>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))}
                    {directionsResponse && (
                      <DirectionsRenderer directions={directionsResponse} />
                    )}
                  </GoogleMap>
                )}
              </Box>
            </>
          )}
        </Box>
      );
    }
  };

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Buyer Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={handleDrawerToggle}>
        <List>
          {['Waste Listings', 'Settings'].map((text) => (
            <ListItem button key={text} onClick={() => setSelectedPage(text)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {renderPageContent()}

      {/* Dialog for pickup scheduling */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Schedule Pickup</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Pickup Date"
              type="date"
              value={pickupData.pickupDate}
              onChange={(e) => setPickupData({ ...pickupData, pickupDate: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              label="Pickup Time"
              type="time"
              value={pickupData.pickupTime}
              onChange={(e) => setPickupData({ ...pickupData, pickupTime: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              label="Quantity (kg)"
              type="number"
              value={pickupData.quantity}
              onChange={(e) => setPickupData({ ...pickupData, quantity: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="primary">Cancel</Button>
              <Button type="submit" color="primary">Schedule</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default BuyerDashboard;
