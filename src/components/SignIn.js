import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
const axios = require("axios");

// css style of elements
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#2B872B",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function SignIn() {
  //use the style
  const classes = useStyles();

  //set the states of the function
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [error, SetError] = useState("");

  // this arrow function to handel the change in the input fields
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  // handel the submit of data
  const submit = async (e) => {
    e.preventDefault();    // prevent reload of the page after submit
    SetError("");
    // given data
    var data = {
      email: state.email,
      password: state.password,
    };
    try {
        //send the data to signin
        await axios
          .post("/login", data)
          .then(function (response) {
            window.localStorage.setItem("ID", response.data);  // set a global id to indicate the login status
            window.location.href = "/"; // go to main page
          })
          .catch(function (error) {
            SetError(error.response.data);
          });
      } catch (error) {
        SetError(error.message);
      }
  };

  // render output
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={submit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={handleChange}
                id="password"
                autoComplete="current-password"
              />
              </Grid>
            </Grid>
            {error !== "" && (
              <Typography className={classes.error} variant="caption">
                {" "}
                * {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              Sign In
            </Button>
          </form>
        </div>
    </Container>
  );
}