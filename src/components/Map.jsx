import React from 'react';
import { BiCurrentLocation } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Map.css'
// Sources
import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ center, setCenter, address, setAddress }) => {
    const { mapIsLoaded } = useAppStates();
    const [map, setMap] = React.useState(/** @type google.maps.Map */(null));
    
    React.useEffect( () => {
        if (!center) {
            setCenter({ lat: 6.2227608, lng: -75.5940676 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickMap = async ({latLng}) => {
        setCenter({ lat: latLng.lat(), lng: latLng.lng() });
        
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ latLng }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                setAddress(results[0].formatted_address);
            } else {
                console.error('Geocode was not successful for the following reason: ', status);
            }
        });
    };

    const handleClickCenter = () => {
        map.panTo(center);
    }
    
    return mapIsLoaded ? (
        <>
            <GoogleMap
                center={center}
                zoom={15}
                mapContainerClassName='map_for_inputs'
                options={{
                    zoomControl: true,
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                }}
                onLoad={(map) => setMap(map)}
                onClick={handleClickMap}
            >
                <BiCurrentLocation size={35} className='center_map_button' onClick={handleClickCenter}/>
                {address && <Marker position={center} />}
            </GoogleMap>
        </>
    ) : (
        <>Cargando el mapa</>
    );
};

export { Map};