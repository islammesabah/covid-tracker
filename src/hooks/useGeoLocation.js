import {useState, useEffect} from 'react'

const useGeoLocation = () =>{
    const [location, setLocation] = useState({
        loaded : false,
        coords:{
            longitude:"",
            latitude:""
        }
    });

    const onSuccess = location => {
        setLocation({
            loaded : true,
            coords:{
                longitude:location.coords.longitude,
                latitude:location.coords.latitude
            }
        });
    }

    const onError = error =>{
        setLocation({
            loaded:false,
            error
        }); 
    };
    

    useEffect(()=>{
        if(!("geolocation" in navigator)){
            onError({
                code : 0,
                message: "Geolocation not supported!"
            })
        }
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    },[]);

    return location;
}

export default useGeoLocation