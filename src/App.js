import MapBox from "./components/MapBox.js";
import useGeoLocation from './hooks/useGeoLocation.js'
import Navbar from './components/Navbar.js'
import SignIn from './components/SignIn.js'
import SignUp from './components/SignUp.js'
import { Box, Typography } from '@material-ui/core';
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

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

function App() {
  const location = useGeoLocation();
  return (
    <div>
      <div className="Header">
          <Navbar />
      </div>
      <Router>
        <div className="App">
          <Route
            exact
            path="/"
            render={(props) => <MapBox /*location={location}*/ />}
          />
          <Route exact path="/signin" render={(props) => <SignIn />} />
          <Route exact path="/signup" render={(props) => <SignUp />} />
        </div>
      </Router>
      <div className="Footer">
        <Box mt={1}>
          <Copyright />
        </Box>
      </div>
    </div>
  );
}

export default App;
