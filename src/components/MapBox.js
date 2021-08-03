import * as React from 'react';
import { useState,useEffect } from 'react';
import ReactMapGL,{Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Room} from '@material-ui/icons'
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';

function MapBox(location) {
  location = location.location
  const [data,setData] = useState([])
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '90vh',
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    zoom: 6
  });

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/islam123/ckrsw83nlhfsy17nybvdrs0k6"
    >
      {location.loaded &&
        <Marker latitude={location.coords.latitude} longitude={location.coords.longitude} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7}>
            <Room style={{fontSize:viewport.zoom * 7, color: 'slateblue'}}/>
        </Marker>
      }
      {data.map(userLocation=>{
        console.log(userLocation);
        <Marker latitude={0} longitude={0} offsetLeft={-10} offsetTop={-10}>
          <FiberManualRecordRoundedIcon style={{fontSize:viewport.zoom * 3, color: 'red'}}/>
        </Marker>
      })}
    </ReactMapGL>
  );
}

export default Map;