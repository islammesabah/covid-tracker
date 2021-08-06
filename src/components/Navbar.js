import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
const axios = require("axios");

// css style of elements
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,    
    backgroundColor: "#2B872B",
    height: '5',
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
  const [userName, setUserName] = useState("");

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
          {(showNavButtons() === 1) &&
            user_id === null && (
              <Button
                className={classes.button}
                variant="outlined"
                color="inherit"
                onClick={(event) => (window.location.href = "/signup")}
              >
                Sign Up
              </Button>
            )}
          {showNavButtons() === 0 && user_id !== null && (
            <Button
              className={classes.button}
              variant="outlined"
              color="inherit"
              onClick={(event) => {
                window.localStorage.removeItem("ID");
                window.location.href = "/";
              }}
            >
              Sign Out
            </Button>
          )}
          {showNavButtons() === 0 && user_id !== null && (
            <Typography className={classes.button}>HI, {userName}</Typography>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
