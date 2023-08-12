import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
// Sources
import axios from 'axios';
import Swal from 'sweetalert2';
import imgSectors from '../assets/images/headerOptions/Sectors.svg';

function Sectors() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();
    const [sectors, setSectors] = React.useState([]);
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        axios.get(`${path}api/Sector/GetSectorsByUser`, { 
            headers: {
                'Authorization': `bearer ${token}`
            },
            withCredentials: true
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            if (!data.sectors.length) {
                addToastr('Registra tu primer sector', 'info');
            }
            setSectors(data.sectors);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleClickAdd = () => {   
        setIsLoading(true);
        navigate('new');
    }

    const handleClickEdit = (id) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }

    const handleClickDelete = (id) => {
        Swal.fire({
            html: `${renderToString(<TiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> el sector?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then(({isConfirmed}) => {
            if (isConfirmed) {
                setIsLoading(true);                
                axios.post(`${path}api/Sector/DeleteSector`, {
                    sector_Id: id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${token}`
                    },
                    withCredentials: true
                }).then(({data})=> {
                    if (data.cod === '-1') {
                        addToastr(data.rpta, 'warning');
                        setIsLoading(false);
                        return;
                    }
                    
                    const updatedList = sectors.filter(table => table.Id !== id);
                    setSectors(updatedList);              
                    addToastr(data.rpta);
                    setIsLoading(false);                    
                }).catch(error => {
                    setIsLoading(false);
                    addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                }); 
            }
        });
    }

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectores' />
            <Button name='Agregar Sector' onClick={handleClickAdd} icon='add' dark />
            <div className='card_container'>
                {
                    sectors.map( ({Id, Name}) => {
                        return(
                            <Card 
                                key={Id}
                                onEdit={() => {handleClickEdit(Id)}}
                                onDelete={() => {handleClickDelete(Id)} }
                                name={Name}
                            />
                        )
                    })
                }
            </div>
        </div>
    );

}

export { Sectors };