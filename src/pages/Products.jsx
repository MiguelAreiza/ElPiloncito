import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { SectionProducts } from '../components/SectionProducts';
// Sources
import axios from 'axios';
import Swal from 'sweetalert2';
import imgProducts from '../assets/images/headerOptions/Products.svg';

function Products() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();
    const [catAndSubcat, setCatAndSubcat] = React.useState([]);
    const [changeProducts, setChangeProducts] = React.useState('');
    
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
            setCatAndSubcat(data.subcategories);
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> el producto?</div>`,
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
                axios.post(`${path}api/Product/DeleteProduct`, {
                    product_Id: id,
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
                    setChangeProducts(id);              
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
            <Header logo={imgProducts} title='Productos' />
            <Button name='Agregar Producto' onClick={handleClickAdd} icon='add' dark />

            {
                catAndSubcat.map( category => {
                    return JSON.parse(category.SubCategories).length > 0 ? (
                        <SectionProducts
                            key={category.Id}
                            category={category}
                            onEdit={handleClickEdit}
                            onDelete={handleClickDelete}
                            reload={changeProducts}
                        />
                    ) : null;
                })
            }
        </div>
    );

}

export { Products };