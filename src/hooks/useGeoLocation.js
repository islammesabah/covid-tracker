import { useState } from "react";

const useGeoLocation = (track) =>{
    
    const [location, setLocation] = useState({
      code: -1,
      longitude: 31.2357,
      latitude: 30.0444,
      message: "load the location...",
    });
    if (!("geolocation" in navigator)) {
        setLocation({ ...location, code: 0, message: "Geolocation not supported!" });
    } else {
        if (!track) {
            navigator.geolocation.getCurrentPosition(data => {
                setLocation({
                  ...location,
                  code: 1,
                  message: "Done",
                  longitude: data.coords.longitude,
                  latitude: data.coords.latitude,
                });
                console.log(data)
            }, err => {
                    setLocation({
                        ...location,
                        code: 2,
                        message: "There are a problem with loaded",
                        err
                      
                    });
                console.log(err);
            }, { enableHighAccuracy: true });
        } else {
            navigator.geolocation.watchPosition(
                (data) => {
                    setLocation({
                      ...location,
                      code: 1,
                      message: "Done",
                      longitude: data.coords.longitude,
                      latitude: data.coords.latitude,
                    });
                    console.log(data);
                },
                (err) => {
                     setLocation({
                       ...location,
                       code: 2,
                       message: "There are a problem with loaded",
                       err,
                     });
                    console.log(err);
                },
                // { enableHighAccuracy: true }
            );
        }
    }
    return location;
}

export default useGeoLocation