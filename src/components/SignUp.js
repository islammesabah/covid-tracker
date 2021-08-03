import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { FormControl, RadioGroup, Radio, Slider, Switch, InputLabel, Select, MenuItem } from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Cast } from "@material-ui/icons";
const axios = require("axios");

const marks = [
  {
    value: 32,
    label: "32",
  },
  {
    value: 42,
    label: "42",
  },
];

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <span>Islam Mesabah </span>
      {new Date().getFullYear()}
      {"."}
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

export default function SignUp() {
    const classes = useStyles();
    const [state, setState] = React.useState({
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      gender: "male",
      password: "",
        confirmPasswordError: "",
      
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value});
    };

    var temperature = 37;
    const setTemperature = (temp) => {
        temperature = temp;
    };
    const [vacciene, setVacciene] = React.useState(false);
    const [location, setLocation] = React.useState(false);
    const [phone_number, setPhoneNumber] = React.useState("");
    const [vacciene_date, setVaccieneDate] = React.useState(new Date());
     const [pcr_result, setPcrResult] = React.useState("");
     const [vacciene_type, setVaccieneType] = React.useState("");

     const handleVaccieneTypeChange = (event) => {
       setVaccieneType(event.target.value);
     };
     const handlePcrResultChange = (event) => {
       setPcrResult(event.target.value);
     };
    const handleVaccieneChange = (event) => {
      setVacciene(event.target.checked);
    };
    const handleLocationChange = (event) => {
      setLocation(event.target.checked);
      
    };
    const [error, SetError] = React.useState("");
    const submit = async (e) => {
        e.preventDefault();
        SetError("");
        var data = {
          vacciene,
          location,
          temperature,
          first_name: state.first_name,
          last_name: state.last_name,
          email: state.email,
          age: state.age,
          gender: state.gender,
          phone_number: phone_number,
          password: state.password,
          pcr_result: pcr_result,
        };
        if (vacciene) {
          data["vacciene_type"] = vacciene_type;
          data["vacciene_date"] = vacciene_date;
        }
        console.log(data)
        
        if (state.confirmPasswordError === "") {
            try {
                
                await axios
                    .post("/user", data)
                    .then(function (response) {
                        console.log(response.data);
                        window.localStorage.setItem("ID", response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                        SetError(error.response.data);
                    });
            } catch (error) {
                console.error(error);
                SetError(error.message);
            }
        }else{
            SetError("Passwords are not matched");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        var errorText = ''
    if (e.target.value !== state.password) {
      errorText = "Passwords are not matched";
    }
    setState({
      ...state,
      confirmPassword: e.target.value,
      confirmPasswordError: errorText,
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar} color="primary">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={submit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h6">
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                id="first_name"
                label="First Name"
                name="first_name"
                onChange={handleChange}
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                id="last_name"
                label="Last Name"
                name="last_name"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                onChange={handleChange}
                autoComplete="email"
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
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Grid container spacing={5} alignItems="center">
                  <Grid item>
                    <Typography id="input-slider" gutterBottom>
                      Gender:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <RadioGroup
                      aria-label="types"
                      name="type"
                      value={state.gender}
                      onChange={handleChange}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <FormControlLabel
                            value="male"
                            control={<Radio color="primary" />}
                            label="Male"
                          />
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            value="female"
                            control={<Radio color="primary" />}
                            label="Female"
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                name="age"
                autoComplete="number"
                required
                fullWidth
                label="Age"
                type="number"
                onChange={handleChange}
                inputProps={{
                  min: 0,
                  max: 150,
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPhoneNumber
                name="phone_number"
                variant="outlined"
                label="Phone Number"
                data-cy="user-phone"
                onChange={setPhoneNumber}
                defaultCountry={"us"}
                fullWidth
                value={phone_number}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography component="h1" variant="h6">
                Health Status
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography id="discrete-slider-always" gutterBottom>
                Temperature
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Slider
                defaultValue={37}
                name="temperature"
                getAriaValueText={setTemperature}
                aria-labelledby="discrete-slider-always"
                step={1}
                min={32}
                max={42}
                marks={marks}
                valueLabelDisplay="on"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  PCR Result
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  placeholder="Not Taken"
                  value={pcr_result}
                  onChange={handlePcrResultChange}
                  name="pcr_result"
                >
                  <MenuItem value="Not Taken">Not Taken</MenuItem>
                  <MenuItem value="Positive">Positive</MenuItem>
                  <MenuItem value="Negative">Negative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography id="discrete-slider-always" gutterBottom>
                Did You take the Vacciene?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Switch
                checked={vacciene}
                onChange={handleVaccieneChange}
                color="primary"
                name="vacciene"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Grid>
            {vacciene && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Vacciene Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="vacciene_type"
                      value={vacciene_type}
                      onChange={handleVaccieneTypeChange}
                    >
                      <MenuItem value="Pfizer">Pfizer</MenuItem>
                      <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                      <MenuItem value="China Vaccine">China Vaccine</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      //   variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      fullWidth
                      id="date-picker-inline"
                      label="Date picker inline"
                      value={vacciene_date}
                      name="vacciene_date"
                      onChange={setVaccieneDate}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography component="h1" variant="h6">
                Location Access
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography id="discrete-slider-always" gutterBottom>
                Track Your Location?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Switch
                checked={location}
                onChange={handleLocationChange}
                color="primary"
                name="location"
                inputProps={{ "aria-label": "primary checkbox" }}
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
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
        <Box mt={5}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
}