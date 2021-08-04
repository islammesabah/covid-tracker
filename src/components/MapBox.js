import * as React from 'react';
import { useState,useEffect } from 'react';
import ReactMapGL,{Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room } from '@material-ui/icons'
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
// import useGeoLocation from "./../hooks/useGeoLocation.js";

import firebase from "firebase";
import { green } from '@material-ui/core/colors';
const axios = require("axios");

const config = {
  apiKey: "AIzaSyAg8JSSERH3O3hF2yGrlqlJHwA4aUxhgW0",
  authDomain: "covid-tracker-2530c.firebaseapp.com",
  databaseURL: "https://covid-tracker-2530c-default-rtdb.firebaseio.com"
};

firebase.initializeApp(config);

const databaseref = firebase.database();
const locationRef = databaseref.ref("/locations");

function MapBox() {
  const distanceRef = 100;
  const maxNum = 3;
  const user_id = window.localStorage.getItem("ID");
  const [users, setUsers] = useState([])


  const getDistance = (user1, user2) => {
    const x1 = user1.longitude;
    const y1 = user1.latitude;
    const x2 = user2.longitude;
    const y2 = user2.latitude;
    const x_2 = x2-x1;
    const y_2 = y2-y1;
    return (Math.sqrt((x_2 * x_2) + (y_2 * y_2)));
  }

  const colorOfDots = (user) => {
    console.log(user)
    if (user.pcr_result === "Positive") return "red";
    if (user.tempreature > 39) return "magenta";
    return 'green';
  }

  const [userLocation, setUserLocation] = useState({
    longitude: 31.2357,
    latitude: 30.0444,
  });
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "85vh",
    zoom: 6,
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
  });

  const updateLocation = async (data) => {
    data["ID"] = user_id;
    console.log(data);
    try {
      await axios
        .post("/location", data)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (("geolocation" in navigator)) {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          setViewport({
            width: "100vw",
            height: "85vh",
            zoom: 6,
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          });
          console.log(data);
        },
        (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true }
      );
      navigator.geolocation.watchPosition(
        (data) => {
          const loc = {
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          };
          setUserLocation(loc);
          updateLocation(loc);
          console.log(data);
        },
        (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true }
      );
    }
    locationRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        delete data[user_id];
        setUsers(data);
        console.log(data)
      }
    });
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/islam123/ckrsw83nlhfsy17nybvdrs0k6"
    >
      <Marker
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
        offsetLeft={-viewport.zoom * 3.5}
        offsetTop={-viewport.zoom * 7}
      >
        <Room style={{ fontSize: viewport.zoom * 7, color: "slateblue" }} />
      </Marker>
      {Object.keys(users).map((key) => (
        <Marker
          key={key.toString()}
          latitude={users[key].latitude}
          longitude={users[key].longitude}
          offsetLeft={-viewport.zoom * 1.5}
          offsetTop={-viewport.zoom * 1.5}
        >
          <FiberManualRecordRoundedIcon
            style={{
              fontSize: viewport.zoom * 3,
              color: colorOfDots(users[key]),
            }}
          />
        </Marker>
      ))}
    </ReactMapGL>
  );
}

export default MapBox;