import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useApi } from '../helpers/api';
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
// Sources
import Swal from 'sweetalert2';
import imgCategories from '../assets/images/headerOptions/Categories.svg';

function Categories() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [categories, setCategories] = React.useState([]);
    const MemoizedTiDelete = React.memo(TiDelete);

    const getCategories = React.useCallback(async () => {
        try {
            const data = await getApiData('Category/GetCategoriesByUser', true);
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }                            
            setCategories(data.categories);
        } catch (error) {
            addToastr(`Error: ${error}`, 'error');
        }
    }, [addToastr, getApiData])
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);
    
    const handleAddCategory = React.useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditCategory = React.useCallback((id) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteCategory = React.useCallback((id) => {
        Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la categoría?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then(async({isConfirmed}) => {
            if (isConfirmed) {
                try {
                    const body = {
                        category_Id: id,
                    }
                    const data = await postApiData('Category/DeleteCategory', body, true, 'application/json');
                    const updatedList = categories.filter(category => category.Id !== id);
                    setCategories(updatedList);              
                    addToastr(data.rpta);
                } catch (error) {
                    addToastr(`Error: ${error}`, 'error');
                }
            }
        });
    }, [postApiData, addToastr, categories]);

    const memoizedHandleEditCategory = React.useMemo(
        () => (id) => handleEditCategory(id),
        [handleEditCategory]
    );

    const memoizedHandleDeleteCategory = React.useMemo(
        () => (id) => handleDeleteCategory(id),
        [handleDeleteCategory]
    );

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Categorías' />
            <Button name='Agregar Categoría' onClick={handleAddCategory} icon='add' dark />

            <div className='card_container'>
                {categories.map(({Id, Name}) => ( 
                    <Card key={Id} onEdit={() => memoizedHandleEditCategory(Id)} onDelete={() => memoizedHandleDeleteCategory(Id)} name={Name} />
                ))}
            </div>
        </div>
    );
}

export { Categories };