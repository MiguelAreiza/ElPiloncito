import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { SectorForm } from '../components/SectorForm';
// Sources
import axios from 'axios';
import imgSectors from '../assets/images/headerOptions/Sectors.svg';

function NewSector() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/sectors',
            option: 'settings'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (name, price, active) => {        
        setIsLoading(true);
        axios.post(`${path}api/Sector/CreateSector`, {
            name: name,
            price: price.replace('$ ','').replace(',',''),
            active: active       
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            withCredentials: true
        }).then( ({data}) => {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }                  
            addToastr(data.rpta);
            navigate('/home/settings/sectors');         
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        }); 
    }

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectores' />
            <SectorForm onCreate={handleClickCreate} />
        </div>
    );
}

export { NewSector };
