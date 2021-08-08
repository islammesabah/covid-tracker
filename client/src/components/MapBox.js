import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import { CircularProgress, Typography } from "@material-ui/core";
import { Room } from "@material-ui/icons";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
import firebase from "firebase/app";
import "firebase/database";
import { makeStyles } from "@material-ui/core/styles";
// import mapboxgl from "mapbox-gl";
// import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";
const axios = require("axios");

// assign workerClass
// mapboxgl.workerClass = MapboxWorker;

//firebae configuration
const config = {
  apiKey: "AIzaSyAg8JSSERH3O3hF2yGrlqlJHwA4aUxhgW0",
  authDomain: "covid-tracker-2530c.firebaseapp.com",
  databaseURL: "https://covid-tracker-2530c-default-rtdb.firebaseio.com",
};

// initiate the firebase app
firebase.initializeApp(config);

// access the firebase database to get realtime location of patients
const databaseref = firebase.database();
const locationRef = databaseref.ref("/locations");

// arrow function to get color of the points
const colorOfDots = (user) => {
  if (user.pcr_result === "Positive") return "orange";
  if (user.temperature > 39) return "yellow";
  return "green";
};

// check if the point will affect the danger zones
const considerForBadRegion = (user) => {
  if (user.pcr_result === "Positive") return true;
  if (user.temperature > 39) return true;
  return 0;
};

// danger zones style
const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": {
      base: 50,
      stops: [
        [0, 10], /// these values for change the radius of point in differebt zoom values
        [4, 15],
        [6, 30],
        [8, 80],
        [11, 500],
        [13, 1500],
      ],
    },
    "circle-color": "rgba(255, 0, 0, 0.5)",
  },
};

// css style of elements
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "85vh",
    display: "grid",
  },
  loadingBar: {
    placeSelf: "center",
  },
  error: {
    color: "red",
    width: "75vw",
    margin: "auto",
    textAlign: "center",
  },
}));

// global variables
const THRESHOULD_REGIONS = 3; // the city will be marked with red if it has this number of affected people
const START_ZOOM = 14;
const CURRENT_USER_SIZE = 7;
const USERS_SIZE = 2;

function MapBox() {
  //use the style
  const classes = useStyles();

  // load the user_id from the localstore to check the signin status
  const user_id = window.localStorage.getItem("ID");

  //set the states of the function
  const [users, setUsers] = useState({});
  const [regions, setRegions] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({
    longitude: 31.2357,
    latitude: 30.0444,
  });
  const [viewport, setViewport] = useState({
    width: "100%", // width of map window
    height: "100%", // height of map window
    zoom: START_ZOOM, // first zoom of map window
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
            width: "100%",
            height: "100%",
            zoom: START_ZOOM,
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          });
        },
        (err) => {
          setError(
            "We need to access your location to track your current location, \n your data will not be available online without your agreement"
          );
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
                          .then(function (response) {})
                          .catch(function (error) {});
                      })
                      .catch(function (error) {});
                  } catch (error) {
                    setError(
                      "We need to access your location to track your current location, \n your data will not be available online without your agreement"
                    );
                  }
                }
              });
            }
          }
        },
        (err) => {
          setError(
            "We need to access your location to track your current location, \n your data will not be available online without your agreement"
          );
        }
      );
    } else {
      setError(
        "We need to access your location to track your current location, your data will not be available online without your agreement"
      );
    }
    // call firebase realtime function to update the realtime location of other users
    try {
      locationRef.on(
        "value",
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            delete data[user_id];
            var localRegions = {};
            Object.keys(data).map((key) => {
              data[key]["color"] = colorOfDots(data[key]);
              // check how many patient in the city
              if (data[key].region && considerForBadRegion(data[key])) {
                if (!localRegions[data[key].region]) {
                  localRegions[data[key].region] = {
                    points: 1,
                  };
                } else {
                  localRegions[data[key].region] = {
                    points: localRegions[data[key].region].points + 1,
                  };
                }
              }
              return null;
            });
            // delete the unneeded cities
            Object.keys(localRegions).map((region) => {
              if (localRegions[region].points < parseInt(THRESHOULD_REGIONS))
                delete localRegions[region];
              return null;
            });
            // get cities coordinates
            axios.get("/region").then(
              (res) => {
                const data = res.data;
                const curData = {
                  type: "FeatureCollection",
                  features: Object.keys(localRegions).map((region) => {
                    return {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [
                          data[region].longitude,
                          data[region].latitude,
                        ],
                      },
                    };
                  }),
                };
                setRegions(curData);
                setDataLoaded(true);
              },
              (err) => {
                setError("we can not load the data please reload the page.");
              }
            );
            setUsers(data);
          }
        },
        (err) => {
          setError("we can not load the data please reload the page.");
        }
      );
    } catch {
      setError("we can not load the data please reload the page.");
    }
  }, [user_id]);

  // marker for the patients
  const markers = useMemo(
    () => {
      if (viewport.zoom > 6) {
        return Object.keys(users).map((key) => (
          <Marker
            key={key}
            latitude={users[key].latitude}
            longitude={users[key].longitude}
            offsetLeft={(-viewport.zoom * USERS_SIZE) / 2}
            offsetTop={-viewport.zoom * USERS_SIZE}
          >
            <FiberManualRecordRoundedIcon
              style={{
                fontSize: viewport.zoom * USERS_SIZE,
                color: users[key].color,
              }}
            />
          </Marker>
        ));
      } 
    },
    [users, viewport.zoom]
  );

  // render the user location if it changed
  const currentUserMarker = useMemo(() => {
    if (viewport.zoom > 2) {
      return (
        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          offsetLeft={-viewport.zoom * CURRENT_USER_SIZE / 2}
          offsetTop={-viewport.zoom * CURRENT_USER_SIZE}
        >
          <Room
            style={{
              fontSize: viewport.zoom * CURRENT_USER_SIZE,
              color: "slateblue",
            }}
          />
        </Marker>
    );
  }
  }, [userLocation, viewport.zoom]);

  // render output
  return (
    <div className={classes.root}>
      {dataLoaded && !error && (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
          mapStyle="mapbox://styles/islam123/ckrsw83nlhfsy17nybvdrs0k6"
        >
          {regions && (
            <Source type="geojson" data={regions}>
              <Layer {...layerStyle} />
            </Source>
          )}
          {markers}
          {currentUserMarker}
        </ReactMapGL>
      )}
      {!dataLoaded && !error && (
        <CircularProgress className={classes.loadingBar} size={100} />
      )}
      {error && <Typography className={classes.error}>{error}</Typography>}
    </div>
  );
}

export default MapBox;
