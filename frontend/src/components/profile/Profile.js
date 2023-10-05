import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),

    minHeight: "50vh",
  },
  profileContainer: {
    backgroundColor: "#ffffff",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
  },
  profilePhotoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    height: theme.spacing(32),
  },
  profilePhoto: {
    width: theme.spacing(24),
    height: theme.spacing(24),
    border: "4px solid #ffffff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  formField: {
    marginBottom: theme.spacing(2),
  },

  editButton: {
    marginLeft: theme.spacing(2),
    color: "#00b4db",
  },
  snackbar: {
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));
const Profile = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoup, setPhotoup] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState(
    window.localStorage.getItem("userName")
  );
  const [isNameEditMode, setNameEditMode] = useState(false);
  const [isContactEditMode, setContactEditMode] = useState(false);
  const [isPhotoEditMode, setPhotoEditMode] = useState(false);
  const id = window.localStorage.getItem("userEmail");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    axios
      .post(
        "https://hfbmbjl766dlrq2ddbj4rbskse0pghjb.lambda-url.us-east-1.on.aws/",
        { id }
      )
      .then((response) => {
        setName(window.localStorage.getItem("userFullName"));
        setContact(response.data.contact);
        setPhoto(response.data.image);
        setEmail(response.data.id);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

  const handleNameEdit = () => {
    setNameEditMode(true);
  };

  const handleContactEdit = () => {
    setContactEditMode(true);
  };
  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleFileChange = (event) => {
    const photo = event.target.files[0];
    setPhotoup(event.target.files[0]);
    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(photo);
  };
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imageRef = ref(storage, `images/${id}`);
    uploadBytes(imageRef, photoup).then(() => {
      getDownloadURL(imageRef)
        .then((url) => {
          const updatedUser = {
            id: id,
            name: name,
            contact: contact,
            image: url,
          };

          axios
            .post(
              "https://dsjlppyl6iqxdasjaqh7kyq6dy0abokk.lambda-url.us-east-1.on.aws/",
              updatedUser
            )
            .then((response) => {
              setName(response.data.name);
              setContact(response.data.contact);
              setPhoto(url);
              setNameEditMode(false);
              setContactEditMode(false);
              showSnackbar("Profile updated successfully!");
            })
            .catch((error) => {
              console.error("Error updating user details:", error);
            });
        })
        .catch((error) => {
          console.error("Error retrieving image download URL:", error);
        });
    });
  };
  const defaultImageUrl = "https://m.media-amazon.com/images/I/41jLBhDISxL.jpg";

  const avatarSrc = photo || defaultImageUrl;
  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} className={classes.profileContainer}>
            <Grid container>
              <Grid item xs={4}>
                <div className={classes.profilePhotoContainer}>
                  <Avatar
                    className={classes.profilePhoto}
                    alt="Profile"
                    src={photo}
                  />
                </div>
                <div>
                  <InputAdornment position="absolute" left={5}>
                    <IconButton
                      component="label"
                      className={classes.editButton}
                    >
                      <EditIcon />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </IconButton>
                  </InputAdornment>
                </div>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h6">Update Details</Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    className={classes.formField}
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    fullWidth
                    InputProps={{
                      readOnly: !isNameEditMode,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            component="label"
                            onClick={handleNameEdit}
                            disabled={isNameEditMode}
                            className={classes.editButton}
                          >
                            <EditIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className={classes.formField}
                    label="Username"
                    value={userName}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className={classes.formField}
                    label="Contact"
                    value={contact}
                    onChange={handleContactChange}
                    fullWidth
                    InputProps={{
                      readOnly: !isContactEditMode,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            component="label"
                            onClick={handleContactEdit}
                            disabled={isContactEditMode}
                            className={classes.editButton}
                          >
                            <EditIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className={classes.formField}
                    label="email"
                    value={email}
                    fullWidth
                    InputProps={{
                      readOnly: !isPhotoEditMode,
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                    }}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Update
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={hideSnackbar}
        message={snackbarMessage}
        className={classes.snackbar}
      />
    </div>
  );
};

export default Profile;
