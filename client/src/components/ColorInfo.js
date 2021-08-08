import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

// css style of elements
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(2),
  },
  title: {
    paddingBottom: "20px",
  },
  form: {
    margin: "auto",
  },
  colors: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    float: "left",
    border: "1",
     display: 'flex',
  justifyContent: 'center'
  },
}));

export default function ChangePassword() {
  //use the style
  const classes = useStyles();

  // render output
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" className={classes.title}>
          Color Code Information
        </Typography>
        <Grid container>
          <div class={classes.colors}>
            <FiberManualRecordIcon
              style={{
                float: "left",
                marginRight: 10,
                fontSize: 30,
                color: "slateblue",
              }}
            />
            <Typography id="discrete-slider-always" gutterBottom>
              Your Location ;)
            </Typography>
          </div>
          <div class={classes.colors}>
            <FiberManualRecordIcon
              style={{
                float: "left",
                marginRight: 10,
                fontSize: 30,
                color: "orange",
              }}
            />
            <Typography id="discrete-slider-always" gutterBottom>
              Positive PCR Result
            </Typography>
          </div>
          <div class={classes.colors}>
            <FiberManualRecordIcon
              style={{
                float: "left",
                marginRight: 10,
                fontSize: 30,
                color: "yellow",
              }}
            />
            <Typography id="discrete-slider-always" gutterBottom>
              Temperature greater than 39
            </Typography>
          </div>
          <div class={classes.colors}>
            <FiberManualRecordIcon
              style={{
                float: "left",
                marginRight: 10,
                fontSize: 30,
                color: "green",
              }}
            />
            <Typography id="discrete-slider-always" gutterBottom>
              Normal persons
            </Typography>
          </div>
          <div class={classes.colors}>
            <FiberManualRecordIcon
              style={{
                float: "left",
                marginRight: 10,
                fontSize: 30,
                color: "red",
              }}
            />
            <Typography id="discrete-slider-always" gutterBottom>
              Danger Zone
            </Typography>
          </div>
        </Grid>
      </div>
    </Container>
  );
}
