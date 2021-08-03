import Map from './components/MapBox.js';
import useGeoLocation from './hooks/useGeoLocation.js'
import Navbar from './components/Navbar.js'
import SignIn from './components/SignIn.js'
import Drawer from './components/Drawer.js'
import FilterMap from './components/FilterMap.js'
import SignUp from './components/SignUp.js'

function App() {
  const myStorage = window.localStorage;
  const location = useGeoLocation();
  return (
    <div className="App">
      {/* <Navbar/>
      {location.loaded &&
        <Map location={location}/>
      } */}
      {/* <SignIn/> */}
      <SignUp />
    </div>
  );
}

export default App;
