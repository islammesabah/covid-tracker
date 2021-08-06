import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
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

export default function ChangePassword() {
  //use the style
  const classes = useStyles();

  //set the states of the function
  const [state, setState] = useState({
    current_password: "",
    new_password: "",
    confirmPassword: ""
  });
  const [error, SetError] = useState("");

  // this arrow function to handel the change in the input fields
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
    
    const handleConfirmPasswordChange = (e) => {
    var errorText = "";
    if (e.target.value !== state.new_password) {
      errorText = "Passwords are not matched";
    }
    setState({
      ...state,
      confirmPassword: e.target.value,
      confirmPasswordError: errorText,
    });
  };


  // handel the submit of data
  const submit = async (e) => {
    e.preventDefault(); // prevent reload of the page after submit
    SetError("");
    // given data
    var data = {
      current_password: state.current_password,
      new_password: state.new_password,
    };
    try {
      //send the data to signin
      await axios
        .post("/changepassword", data)
        .then(function (response) {
          window.localStorage.removeItem("ID"); // set a global id to indicate the login status
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
        <Typography component="h1" variant="h5">
          Change Current Password
        </Typography>
        <form className={classes.form} onSubmit={submit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="current_password"
                label="current_password"
                type="current_password"
                onChange={handleChange}
                id="current_password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="new_password"
                label="new_password"
                type="new_password"
                onChange={handleChange}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                name="confirmPassword"
                autoComplete="current-password"
                required
                fullWidth
                label="Confirmed Password"
                type="password"
                onChange={handleConfirmPasswordChange}
              />
            </Grid>
            {state.confirmPasswordError !== "" && (
              <Grid item xs={12}>
                <span className={classes.error}>
                  * {state.confirmPasswordError}
                </span>
              </Grid>
            )}
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
            Change
          </Button>
        </form>
      </div>
    </Container>
  );
}
