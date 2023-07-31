import React from 'react';
// import { Navigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { Map } from '../components/Map';
// import { Button } from '../components/Button';
// Styles
import '../styles/Auth.css';
// Sources
// import axios from 'axios';
import imgLogo from '../assets/images/Logo.svg';

function Delivery() {
    const { setIsLoading, setMenuConfig } = useAppStates();

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
            <Map />
        </div>
    );
}

export { Delivery };