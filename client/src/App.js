import { Box, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Route } from "react-router-dom";
import MapBox from "./components/MapBox";
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// Add copyright line at the bottom "Copyright © Islam Mesabah 2021"
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

// main app function
function App() {
  return (
    <div>
      <div>
          <Navbar />
      </div>
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={(props) => <MapBox/>}
          />
          <Route exact path="/signin" render={(props) => <SignIn />} />
          <Route exact path="/signup" render={(props) => <SignUp />} />
        </div>
      </Router>
      <div>
        <Box mt={1}>
          <Copyright />
        </Box>
      </div>
    </div>
  );
}

export default App;
