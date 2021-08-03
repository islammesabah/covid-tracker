import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FilterIcon from '@material-ui/icons/Filter';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#2B872B",
    height: "2",
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
  },
}));

const showNavButtons = () => {
  console.log(window.location.pathname);
  if (window.location.pathname.startsWith("/signin"))  return 1;
  if (window.location.pathname.startsWith("/signup"))  return 2;
  return 0;
};

export default function NavBar() {
  const classes = useStyles();
  
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
          {showNavButtons() === 0 && (
            <Button
              startIcon={<FilterIcon />}
              className={classes.button}
              variant="outlined"
              color="inherit"
            >
              Filter
            </Button>
          )}
          {(showNavButtons() === 0 || showNavButtons() === 2) && (
            <Button
              className={classes.button}
              variant="outlined"
              color="inherit"
              onClick={(event) => (window.location.href = "/signin")}
            >
              Sign In
            </Button>
          )}
          {(showNavButtons() === 0 || showNavButtons() === 1) && (
            <Button
              className={classes.button}
              variant="outlined"
              color="inherit"
              onClick={(event) => (window.location.href = "/signup")}
            >
              Sign Up
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
