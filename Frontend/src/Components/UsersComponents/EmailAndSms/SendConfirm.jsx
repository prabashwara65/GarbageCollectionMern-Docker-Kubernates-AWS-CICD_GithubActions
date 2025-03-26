import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "leaflet/dist/leaflet.css";
import ViewGarbageCollection from "../CollectionCrud/ViewGarbageCollection";

// Define coordinates for 3 different locations in Sri Lanka
const locations = [
  { lat: 8.76, lng: 80.25, name: "Area 1  - Middle-West", area: "Area 1" },
  { lat: 6.9271, lng: 79.8612, name: "Area 2  - Colombo", area: "Area 2" },
  { lat: 7.8731, lng: 80.7718, name: "Area 3  - Central", area: "Area 3" },
];

// Email sending function for confirmation
const sendEmail = async (email, _id) => {
  try {
    await axios.post("http://localhost:4000/users/send-confirmation", {
      email,
      _id,
    });
    return email;
  } catch (err) {
    console.error("Error sending message:", err);
    throw new Error("Failed to send message");
  }
};

// Email sending function for notifications
const sendNotificationEmail = async (email, _id) => {
  try {
    await axios.post("http://localhost:4000/users/send-notification", {
      email,
      _id,
      message: "Garbage truck is about to come to your area",
    });
    return email;
  } catch (err) {
    console.error("Error sending notification:", err);
    throw new Error("Failed to send notification");
  }
};

// MapCard component displaying the map, user count, and buttons
const MapCard = ({ title, coordinates, userCount, users }) => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [successEmails, setSuccessEmails] = useState([]);

  const handleSendMessages = async () => {
    setLoading(true);
    const emails = [];
    try {
      await Promise.all(
        users.map(async (user) => {
          const email = await sendEmail(user.email, user._id);
          emails.push(email);
        })
      );
      setSuccessEmails(emails);
      setOpenDialog(true);
    } catch {
      alert("Failed to send one or more messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async () => {
    setLoading(true);
    const emails = [];
    try {
      await Promise.all(
        users.map(async (user) => {
          const email = await sendNotificationEmail(user.email, user._id);
          emails.push(email);
        })
      );
      setSuccessEmails(emails);
      setOpenDialog(true);
    } catch {
      alert("Failed to send one or more notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card sx={{ width: "100%" }}>
        {" "}
        {/* Adjust width for responsiveness */}
        <CardMedia>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={8} // Adjust zoom level for Sri Lanka
            style={{ height: "200px", width: "100%" }} // Use percentage width for responsiveness
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong className="text-md">Number of users in this area:</strong>{" "}
            <span className="text-bold">{userCount}</span>
          </Typography>
          <Box display="flex" justifyContent="space-between" marginTop={4}>
            <Button
              className=" h-14 w-40 mx-2"
              variant="contained"
              color="secondary"
              onClick={handleSendNotifications}
              disabled={users.length === 0}
            >
              Send Notification
            </Button>
            <Button
              className="mt-10 h-14 w-40"
              variant="contained"
              color="primary"
              onClick={handleSendMessages}
              disabled={users.length === 0}
            >
              Send Messages
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle className="m-auto">Success</DialogTitle>
        <DialogContent>
          <div className="flex flex-col">
            <Typography variant="h6">Emails sent successfully:</Typography>
            <List>
              {successEmails.map((email, index) => (
                <ListItem key={index}>
                  <ListItemText primary={email} />
                  <CheckCircleIcon style={{ color: "green", marginRight: 8 }} />
                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// MapCards component fetching users and displaying them in cards by area
const MapCards = () => {
  const [garbageCollectionList, setGarbageCollectionList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/register/ViewUsers")
      .then((res) => {
        setGarbageCollectionList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filterUsersByArea = (area) => {
    return garbageCollectionList.filter((user) => user.area === area);
  };

  return (
    <div className="div">
      <Grid container spacing={3} justifyContent="center">
        {" "}
        {/* Adjust grid spacing */}
        {locations.map((location, index) => {
          const usersInArea = filterUsersByArea(location.area);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              {" "}
              {/* Adjust breakpoints for responsiveness */}
              <MapCard
                title={location.name}
                coordinates={location}
                userCount={usersInArea.length}
                users={usersInArea}
              />
            </Grid>
          );
        })}
      </Grid>
      <div className="text-black bg-transparent shadow-lg mt-7">
        <ViewGarbageCollection />
      </div>
    </div>
  );
};

export default MapCards;
