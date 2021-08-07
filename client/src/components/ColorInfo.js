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
    width: "50%",
    margin: "auto",
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
          <Grid item xs={9} sm={3}>
            <FiberManualRecordIcon
              style={{
                marginLeft: "25%",
                fontSize: 30,
                color: "slateblue",
              }}
            />
          </Grid>
          <Grid item xs={9} sm={9}>
            <Typography id="discrete-slider-always" gutterBottom>
              Your Location ;)
            </Typography>
          </Grid>
          <Grid item xs={9} sm={3}>
            <FiberManualRecordIcon
              style={{ marginLeft: "25%", fontSize: 30, color: "orange" }}
            />
          </Grid>
          <Grid item xs={9} sm={9}>
            <Typography id="discrete-slider-always" gutterBottom>
              Positive PCR Result
            </Typography>
          </Grid>
          <Grid item xs={9} sm={3}>
            <FiberManualRecordIcon
              style={{ marginLeft: "25%", fontSize: 30, color: "yellow" }}
            />
          </Grid>
          <Grid item xs={9} sm={9}>
            <Typography id="discrete-slider-always" gutterBottom>
              Temperature greater than 39
            </Typography>
          </Grid>
          <Grid item xs={9} sm={3}>
            <FiberManualRecordIcon
              style={{ marginLeft: "25%", fontSize: 30, color: "green" }}
            />
          </Grid>
          <Grid item xs={9} sm={9}>
            <Typography id="discrete-slider-always" gutterBottom>
              Normal persons
            </Typography>
          </Grid>
          <Grid item xs={9} sm={3}>
            <FiberManualRecordIcon
              style={{ marginLeft: "25%", fontSize: 30, color: "red" }}
            />
          </Grid>
          <Grid item xs={9} sm={9}>
            <Typography id="discrete-slider-always" gutterBottom>
              Danger Zone
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
