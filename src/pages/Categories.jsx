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
import imgCategories from '../assets/images/headerOptions/Categories.svg';

function Categories() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = React.useState([]);
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        axios.get(`${path}api/Category/GetCategoriesByUser`, {
            headers: {
                'Authorization': `bearer ${token}`,
            },
            withCredentials: true
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }                            
            setCategories(data.categories);
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la categoría?</div>`,
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
                axios.post(`${path}api/Category/DeleteCategory`, {
                    category_Id: id,
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

                    const updatedList = categories.filter(category => category.Id !== id);
                    setCategories(updatedList);              
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
            <Header logo={imgCategories} title='Categorías' />
            <Button name='Agregar Categoría' onClick={handleClickAdd} icon='add' dark />
            <div className='card_container'>
                {
                    categories.map( ({Id, Name}) => {
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

export { Categories };