import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';
import imgCategories from '../../assets/images/headerOptions/Categories.svg';

interface Category {
    Id: string
    Name: string
    Active: boolean
}

interface GetCategoriesData {
    categories: Array<Category>;
    cod: string;
}

function Categories() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Array<Category>>([]);
    const MemoizedTiDelete = memo(TiDelete);

    const getCategories = useCallback(async () => {
        if (categories.length !== 0) {
            return;
        }
        try {
            const data: GetCategoriesData = await getApiData('Category/GetCategoriesByUser', true);
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }
            setCategories(data.categories);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [categories, addToastr, getApiData]);
    
    useEffect(() => {
        setMenuConfig({
            path: '/home/settings',
            option: 'settings'
        });
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleAddCategory = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditCategory = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteCategory = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la categoría?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            try {
                const body = { 'category_Id': id }
                const data: ResponseApi = await postApiData('Category/DeleteCategory', body, true, 'application/json');
                setCategories(prevCategories => prevCategories.filter(category => category.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    const categoryComponents: React.JSX.Element[] = useMemo(() => (
        categories.map(({ Id, Name }) => (
            <Card
                key={Id}
                onEdit={() => handleEditCategory(Id)}
                onDelete={() => handleDeleteCategory(Id)}
                type='basic'
                item={{ name: Name }}
            />
        ))
    ), [categories, handleEditCategory, handleDeleteCategory]);

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Categorías' />
            <Button name='Agregar Categoría' type='button' onClick={handleAddCategory} icon='add' template='dark' />

            <div className='card_container'>
                {categoryComponents}
            </div>
        </div>
    );
}

export { Categories };