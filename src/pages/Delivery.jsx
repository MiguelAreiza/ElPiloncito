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
	const mapLibs = ['places','visualization','drawing','geometry'];
   
    React.useEffect( () => {
        setMenuConfig(() => ({
            basic: true,
            active: true,
            path: '/'
        }));
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='DOMICILIOS' />

            <LoadScript googleMapsApiKey='AIzaSyCza8PJmvppMHmHJyfwuxVFWFbK4KiL3_k' libraries={mapLibs}>
                
            </LoadScript>
        </div>
    );
}

export { Delivery };