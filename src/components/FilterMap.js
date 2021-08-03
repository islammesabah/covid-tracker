import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Slider, Input, FormControlLabel, FormControl, RadioGroup, Radio } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input:{
    marginLeft: theme.spacing(1),
  },
  form: {
    width: '80%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
   },
 
}));

const marks = [
    {
      value: 3,
      label: '3',
    },
    {
      value: 10,
      label: '10',
    },
  ];
const distMarks = [
    {
      value: 20,
      label: '20',
    },
    {
      value: 200,
      label: '200',
    },
  ];

function valuetext(value) {
    return `${value}°C`;
  }

export default function FilterMap() {
  const classes = useStyles();
  const [valueD, setValue] = React.useState(100);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (valueD < 20) {
      setValue(20);
    } else if (valueD > 200) {
      setValue(200);
    }
  };

  const [value, setValueR] = React.useState('temp');

  const handleChange = (event) => {
    setValueR(event.target.value);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={12} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Filter Map Hotspots
          </Typography>
          <form className={classes.form} noValidate>
            <Typography id="discrete-slider-always" gutterBottom>
            Filter Number of Point in Hotspot
            </Typography>
            <Slider
            defaultValue={5}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-always"
            step={1}
            min= {3}
            max= {10}
            marks={marks}
            valueLabelDisplay="on"
            />
            <div>
                <Typography id="input-slider" gutterBottom>
                    Filter Distance
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={typeof valueD === 'number' ? valueD : 0}
                      onChange={handleSliderChange}
                      aria-labelledby="input-slider"
                      marks={distMarks}
                      step={10}
                      min= {20}
                      max= {200}
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      className={classes.input}
                      value={valueD}
                      margin="dense"
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      inputProps={{
                      step: 10,
                      min: 20,
                      max: 200,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                      }}
                    />
                  </Grid>
                </Grid>
                </div>
            <div>
            <FormControl component="fieldset">
            <Typography id="input-slider" gutterBottom>
            Showed Types
                </Typography>
              <RadioGroup aria-label="types" name="type" value={value} onChange={handleChange}>
              <Grid container spacing={2} alignItems="center">
                  <Grid item>
                <FormControlLabel value="temp" control={<Radio color='primary'/>} label="Tempreature above 35°C" />
                </Grid>
                <Grid item>
                <FormControlLabel value="all" control={<Radio color='primary'/>} label="All" />
                </Grid>
                <Grid item>
                <FormControlLabel value="corona" control={<Radio color='primary'/>} label="Positive Corona" />
                </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
                </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              Filter
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}