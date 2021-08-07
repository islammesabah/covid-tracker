import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { MenuItem } from '@material-ui/core';
import Menu from "@material-ui/core/Menu";
import Dialog from "@material-ui/core/Dialog";
import UpdateUserData from "./UpdateUserData";
import ChangePassword from "./ChangePassword";
const axios = require("axios");

// css style of elements
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#2B872B",
    height: "5",
  },
  title: {
    flexGrow: 1,
    marginLeft: "10px",
    cursor: "pointer",
  },
  icon: {
    height: "40px",
    width: "40px",
    cursor: "pointer",
  },
  button: {
    marginLeft: "10px",
    display: "flex",
    cursor: "pointer",
  },
  typography: {
    padding: theme.spacing(2),
    fontSize: 16,
    display: 'block',
    width: "200px",
    // margin:'auto'
  },
}));

// control the appearing of navbar buttons
const showNavButtons = () => {
  if (window.location.pathname.startsWith("/signin"))  return 1;
  if (window.location.pathname.startsWith("/signup"))  return 2;
  return 0;
};

export default function NavBar() {
  //use the style
  const classes = useStyles();

  // load the user_id from the localstore to check the signin status
  const user_id = window.localStorage.getItem("ID");

  //set the states of the function
  const [userName, setUserName] = useState(null);
  const [update, setUpdate] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  // ancher of the main menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  

  // handle start and close of amin menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUpdate(false);
    setChangePassword(false);
  };

  // load the first name to print it in navbar
  useEffect(() => {
    if (user_id !== null) {
      axios.get("/user?ID=" + user_id).then((res) => {
        setUserName(res.data.first_name);
      });
    }
  }, [user_id]);

  // render output
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar color="green">
          <img
            src={process.env.PUBLIC_URL + "/icon.png"}
            alt="Covid Tracker"
            className={classes.icon}
            onClick={(event) => (window.location.href = "/")}
          />
          <Typography
            variant="h6"
            className={classes.title}
            onClick={(event) => (window.location.href = "/")}
          >
            Covid Tracker
          </Typography>
          {(showNavButtons() === 0 || showNavButtons() === 2) &&
            user_id === null && (
              <Button
                className={classes.button}
                variant="outlined"
                color="inherit"
                onClick={(event) => (window.location.href = "/signin")}
              >
                Sign In
              </Button>
            )}
          {showNavButtons() === 1 && user_id === null && (
            <Button
              className={classes.button}
              variant="outlined"
              color="inherit"
              onClick={(event) => (window.location.href = "/signup")}
            >
              Sign Up
            </Button>
          )}
          {showNavButtons() === 0 && user_id && userName && (
            <Typography className={classes.button} onClick={handleClick}>
              HI, {userName}
            </Typography>
          )}
        </Toolbar>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              setUpdate(true);
              handleClose();
              setOpenDialog(true);
            }}
            color="primary"
          >
            Update your Data
          </MenuItem>
          <MenuItem
            onClick={() => {
              setChangePassword(true);
              handleClose();
              setOpenDialog(true);
            }}
            color="primary"
          >
            Change Password
          </MenuItem>
          <MenuItem
            onClick={(event) => {
              window.localStorage.removeItem("ID");
              window.location.href = "/";
            }}
            color="primary"
          >
            Sign Out
          </MenuItem>
        </Menu>
        <Dialog
          onClose={handleCloseDialog}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
        >
          {update && <UpdateUserData />}
          {changePassword && <ChangePassword />}
        </Dialog>
      </AppBar>
    </div>
  );
}
