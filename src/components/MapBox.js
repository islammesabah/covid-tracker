import * as React from 'react';
import { useState, useEffect, useMemo } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import { Room } from '@material-ui/icons'
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import firebase from "firebase/app";
import "firebase/database";
const axios = require("axios");

//firebae configuration 
const config = {
  apiKey: "AIzaSyAg8JSSERH3O3hF2yGrlqlJHwA4aUxhgW0",
  authDomain: "covid-tracker-2530c.firebaseapp.com",
  databaseURL: "https://covid-tracker-2530c-default-rtdb.firebaseio.com"
};

// initiate the firebase app
firebase.initializeApp(config);

// access the firebase database to get realtime location of patients
const databaseref = firebase.database();
const locationRef = databaseref.ref("/locations");
const regionRef = databaseref.ref("/region");

// arrow function to get 
const colorOfDots = (user) => {
  if (user.pcr_result === "Positive") return "red";
  if (user.tempreature > 39) return "magenta";
  return "green";
};


const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.4, 37.8] },
    },
  ],
};

const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 50,
    "circle-color": "#007cbf",
  },
};

function MapBox() {
  const THRESHOULD_POINT = 1
  // load the user_id from the localstore to check the signin status
  const user_id = window.localStorage.getItem("ID");

  //set the states of the function
  const [users, setUsers] = useState({});
  const [regions,] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState({
    longitude: 31.2357,
    latitude: 30.0444,
  });
  const [viewport, setViewport] = useState({
    width: "100vw", // width of map window
    height: "85vh", // height of map window
    zoom: 6, // first zoom of map window
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
  });

  // loaded after render the function or user_id change
  useEffect(() => {
    // get the user location
    if ("geolocation" in navigator) {
      // at the start get the location to center the seen on the user
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
      // get the realtime location and update the database
      navigator.geolocation.watchPosition(
        (data) => {
          const loc = {
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          };
          setUserLocation(loc);
          if (user_id !== null) {
            if (user_id !== null) {
              axios.get("/user?ID=" + user_id).then((res) => {
                if (res.data.location) {
                  loc["ID"] = user_id;
                  try {
                    axios
                      .post("/region", loc)
                      .then(function (response) {
                        loc["region"] = response.data;
                        axios
                          .post("/location", loc)
                          .then(function (response) {
                            console.log(response.data);
                          })
                          .catch(function (error) {
                            console.log(error);
                          });
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  } catch (error) {
                    console.error(error);
                  }
                }
              });
            }
          }
          console.log(data);
        },
        (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true }
      );
    }
    // call firebase realtime function to update the realtime location of other users
    locationRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        delete data[user_id];
        console.log(data);
        Object.keys(data).map((key) => { 
            (data[key]["color"] = colorOfDots(data[key]))
            if (data[key].place)
              if (!regions[data[key].place])
                regions[data[key].place] = {
                  points: 1,
                };
            else regions[data[key].place] = {
              points: regions[data[key].place].points+1,
            };
          }
        );
         Object.keys(regions).map((region) => {
             if (!regions[region].points < THRESHOULD_POINT) delete regions[region];
         });
        regionRef.on("value", (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).map((region) => {
              regions["geojson"] = data[region].geojson;
            });
            setDataLoaded(true);
          }
        });
        console.log(regions);
        setUsers(data);
        console.log(data);
      }
    });
  }, [user_id]);

  // render the marks if users changed
  // const region = useMemo(
  //   () =>
  //     Object.keys(regions).map((key) => (
  //       <Marker
  //         key={key}
  //         latitude={users[key].latitude}
  //         longitude={users[key].longitude}
  //         offsetLeft={-viewport.zoom * 1.5}
  //         offsetTop={-viewport.zoom * 3}
  //       >
  //         <FiberManualRecordRoundedIcon
  //           style={{ fontSize: viewport.zoom * 3, color: users[key].color }}
  //         />
  //       </Marker>
  //     )),
  //   [users]
  // );
  
  const markers = useMemo(
    () =>
      Object.keys(users).map((key) => (
        <Marker
          key={key}
          latitude={users[key].latitude}
          longitude={users[key].longitude}
          offsetLeft={-viewport.zoom * 1.5}
          offsetTop={-viewport.zoom * 3}
        >
          <FiberManualRecordRoundedIcon
            style={{ fontSize: viewport.zoom * 3, color: users[key].color }}
          />
        </Marker>
      )),
    [users]
  );

  // render the user location if it changed
  const currentUserMarker = useMemo(
    () => (
      <Marker
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
        offsetLeft={-viewport.zoom * 3.5}
        offsetTop={-viewport.zoom * 7}
      >
        <Room style={{ fontSize: viewport.zoom * 7, color: "slateblue" }} />
      </Marker>
    ),
    [userLocation]
  );

  // render output
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/islam123/ckrsw83nlhfsy17nybvdrs0k6"
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
      {currentUserMarker}
      {markers}
    </ReactMapGL>
  );
}

export default MapBox;