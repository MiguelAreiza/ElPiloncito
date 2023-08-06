import React from 'react';

// Components
import { Input } from '../components/Input';
// Sources
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
const libraries = process.env.REACT_APP_GOOGLE_MAPS_API_LIBRARIES.split(',');
const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Map = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: key, 
        libraries: libraries
    });
    const [map, setMap] = React.useState(/** @type google.maps.Map */(null));
    const [address, setAddress] = React.useState('');
    const [center, setCenter] = React.useState({ lat: 6.2227608, lng: -75.5940676 });
    const [selectedPlace, setSelectedPlace] = React.useState(null);
    
    const handleLoadAutocomplete = (autocomplete) => {
        setSelectedPlace(autocomplete);
    };

    const handleChangeAutocomplete = () => {
        if (selectedPlace) {
            const place = selectedPlace.getPlace();
            const formattedAddress = place.formatted_address || '';
            setAddress(formattedAddress);
            geocodeAddress(formattedAddress);
        }
    };

    const geocodeAddress = (address) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                setCenter({ lat: lat(), lng: lng() });
            } else {
                console.error('Geocode was not successful for the following reason: ', status);
            }
        });
    };

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
    
    return isLoaded ? (
        <>
            <div>
                <Autocomplete onLoad={handleLoadAutocomplete} onPlaceChanged={handleChangeAutocomplete}>
                    <Input name='Direccion' type='text' value={address} setValue={setAddress} />
                </Autocomplete>               
            </div>
               
            <button onClick={handleClickCenter}>Centrar</button> 

            <GoogleMap
                center={center}
                zoom={15}
                mapContainerStyle={{ width: '100vw', height: '500px' }}
                options={{
                    zoomControl: true,
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                }}
                onLoad={(map) => setMap(map)}
                onClick={handleClickMap}
            >
                {address && <Marker position={center} />}
            </GoogleMap>
        </>
    ) : (
        <>Cargando el mapa</>
    );
};

export { Map};