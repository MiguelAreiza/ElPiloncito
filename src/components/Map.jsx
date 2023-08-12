import React from 'react';
import { BiCurrentLocation } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Map.css'
// Sources
import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ center, setCenter, address, setAddress, onlyView, zoom, className, clickable, icon }) => {
    const { apiMapsIsLoaded } = useAppStates();
    const [map, setMap] = React.useState(/** @type google.maps.Map */(null));

    React.useEffect( () => {
        if (!onlyView) {
            if (address) {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK' && results && results.length > 0) {
                        const { lat, lng } = results[0].geometry.location;
                        setCenter({ lat: lat(), lng: lng() });
                    } else {
                        console.error('Geocode was not successful for the following reason: ', status);
                    }
                });
            }
            if (!center) {
                setCenter({ lat: 6.2227608, lng: -75.5940676 });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMap = (map) => {
        setTimeout(() => {
            setMap(map);
        }, 300);
    }

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
    
    return apiMapsIsLoaded ? (
        <GoogleMap
            center={center}
            zoom={zoom || 15}
            mapContainerClassName={className}
            options={{
                zoomControl: true, streetViewControl: true, mapTypeControl: true, fullscreenControl: true
            }}
            onLoad={handleLoadMap}
            onClick={clickable ? handleClickMap : null}
        >
            <BiCurrentLocation size={30} className='center_map_button' onClick={handleClickCenter}/>
            {map && <Marker position={center} icon={icon} />}
        </GoogleMap>
    ) : (
        <div style={{display:'block',width:'100%'}}>Cargando el mapa</div>
    );
};

export { Map};