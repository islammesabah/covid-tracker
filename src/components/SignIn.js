import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
const axios = require("axios");

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
  const classes = useStyles();
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const [error, SetError] = React.useState("");

  const submit = async (e) => {
    e.preventDefault();
    SetError("");
    var data = {
      email: state.email,
      password: state.password,
    };
    console.log(data);
    try {
        console.log("Dff");
        await axios
          .post("/login", data)
          .then(function (response) {
            console.log(response.data);
            window.localStorage.setItem("ID", response.data);
          })
          .catch(function (error) {
            console.log(error);
            SetError(error.response.data);
          });
      console.log("Dff");
      } catch (error) {
        console.error(error);
        SetError(error.message);
      }
  };
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
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
    </Container>
  );
}