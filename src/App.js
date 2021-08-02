import Map from './components/MapBox.js';
import useGeoLocation from './hooks/useGeoLocation.js'
import Navbar from './components/Navbar.js'
import SignIn from './components/SignIn.js'
import Drawer from './components/Drawer.js'

function App() {
  const location = useGeoLocation();
  return (
    <div className="App">
      {/* <Navbar/>
      {location.loaded &&
        <Map location={location}/>
      } */}
      {/* <SignIn/> */}
      <Drawer/>
    </div>
  );
}

export default App;
