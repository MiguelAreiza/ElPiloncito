import React from 'react';
import { GoogleMap, Marker, LoadScript, Autocomplete } from '@react-google-maps/api';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Auth.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';

function Delivery() {
    const { setIsLoading, setMenuConfig, addToastr } = useAppStates();
    const [location, setLocation] = React.useState({ lat: 6.2227562, lng: -75.6641082 });
    const autocompleteRef = React.useRef(null);
	const mapLibs = ['places','visualization','drawing','geometry'];
   
    React.useEffect( () => {
        setMenuConfig(() => ({
            basic: true,
            active: true,
            path: '/'
        }));

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // setLocation({ lat: position.coords.latitude, lng: position.coords.longitude});
                },
                function (error) {
                    addToastr('Hubo un error al obtener la ubicación: ' + error.message, 'warning');
                }
            );
        } else {
            addToastr('Tu navegador no soporta geolocalización', 'info');
        }

        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const { lat, lng } = place.geometry.location;
                setLocation({ lat: lat(), lng: lng() });
            }
        }
    };

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='DOMICILIOS' />

            <LoadScript googleMapsApiKey='AIzaSyCza8PJmvppMHmHJyfwuxVFWFbK4KiL3_k' libraries={mapLibs}>
                <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
                    <input type='text' placeholder='Ingresa tu dirección' />
                </Autocomplete>
                <GoogleMap center={location} zoom={12} mapContainerStyle={{ height: '400px', width: '500px' }}>
                    { location.lat && location.lng && <Marker position={location} /> }
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export { Delivery };