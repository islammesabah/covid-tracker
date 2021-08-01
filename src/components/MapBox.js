import * as React from 'react';
import { useState } from 'react';
import ReactMapGL,{Marker} from 'react-map-gl';
import {Room} from '@material-ui/icons'
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import useGeoLocation from '../hooks/useGeoLocation.js'

function Map() {
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 30.0444,
    longitude: 31.2357,
    zoom: 6
  });

  const location = useGeoLocation();

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/islam123/ckrsw83nlhfsy17nybvdrs0k6"
    >
      {location.loaded &&
        <Marker latitude={location.coords.latitude} longitude={location.coords.longitude} offsetLeft={-20} offsetTop={-10}>
            <Room style={{fontSize:viewport.zoom * 7, color: 'slateblue'}}/>
        </Marker>
      }
        <Marker latitude={0} longitude={0} offsetLeft={-20} offsetTop={-10}>
            <FiberManualRecordRoundedIcon style={{fontSize:viewport.zoom * 3, color: 'red'}}/>
        </Marker>
    </ReactMapGL>
  );
}

export default Map;