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
import imgSubcategories from '../assets/images/headerOptions/Subcategories.svg';

function Subcategories() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();
    const [subcategories, setSubcategories] = React.useState([]);
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        axios.get(`${path}api/Subcategory/GetSubcategoriesByCategories`, {
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
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }                            
            setSubcategories(data.subcategories);
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la subcategoría?</div>`,
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
                axios.post(`${path}api/Subcategory/DeleteSubcategory`, {
                    subcategory_Id: id,
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
                    const updatedList = subcategories.map( category => {
                        const subcategories = JSON.parse(category.SubCategories);
                        const filtered = subcategories.filter(subcategory => subcategory.Id !== id);
                        category.SubCategories = JSON.stringify(filtered);
                        return category;
                    });
                    setSubcategories(updatedList);              
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
            <Header logo={imgSubcategories} title='Subcategorías' />
            <Button name='Agregar Subcategoría' onClick={handleClickAdd} icon='add' dark />

            {
                subcategories.map( category => {
                    return JSON.parse(category.SubCategories).length > 0 ? (                         
                        <div className='card_container' key={category.Id}>
                            <h3 className='category_name'>{category.Name}</h3>
                            {
                                JSON.parse(category.SubCategories).map( subcategory => {
                                    return( 
                                        <Card 
                                            key={subcategory.Id}
                                            onEdit={ () => handleClickEdit(subcategory.Id)}
                                            onDelete={ () => handleClickDelete(subcategory.Id) }
                                            name={subcategory.Name}
                                        />
                                    )
                                })
                            }
                        </div>
                    ) : null;
                })
            }
        </div>
    );

}

export { Subcategories };