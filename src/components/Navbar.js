import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FilterIcon from '@material-ui/icons/Filter';
import SignIn from './SignIn.js'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#2B872B" ,
    height:'10vh'
  },
  title: {
    flexGrow: 1,
    marginLeft: '10px'
  },
  icon:{
    height: '40px',
    width: '40px'
  },
  button:{
    marginLeft: '10px'
  }
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar color="green">
            <img src= {process.env.PUBLIC_URL  + "/icon.png"} alt="Covid Tracker" className={classes.icon}/>
            <Typography variant="h6" className={classes.title}>
                Covid Tracker
            </Typography>
            <Button startIcon={<FilterIcon />} className={classes.button} variant="outlined" color="inherit">Filter</Button>
            <Button className={classes.button} variant="outlined" color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <SignIn/>
    </div>
  );
}
