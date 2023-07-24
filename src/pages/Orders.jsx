import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Sources
import axios from 'axios';
import Swal from 'sweetalert2'; 
import imgLogo from '../assets/images/Logo.svg';

function Orders() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/activities',
            option: 'activities'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);
    
    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='NUEVO PEDIDO' />
        </div>
    );

}

export { Orders };