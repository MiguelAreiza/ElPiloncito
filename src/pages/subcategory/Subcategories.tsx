import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import imgSubcategories from '../../assets/images/headerOptions/Subcategories.svg';

interface Subcategory {
    Id: string
    Name: string
}

interface Category {
    Id: string
    Name: string
    SubCategories: string | Subcategory
}

interface GetSubcategoriesData {
    subcategories: Array<Category>;
    cod: string;
}

function Subcategories() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [subcategories, setSubcategories] = useState<Array<Category>>([]);    
    const MemoizedTiDelete = memo(TiDelete);

    const getSubcategories = useCallback(async () => {
        if (subcategories.length !== 0) {
            return;
        }
        try {
            const data: GetSubcategoriesData = await getApiData('Subcategory/GetSubcategoriesByCategories', true);
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }                            
            setSubcategories(data.subcategories);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [subcategories, addToastr, getApiData])

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings',
            option: 'settings'
        });
        getSubcategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ]);
    
    const handleAddSubcategory = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditSubcategory = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);
    
    const handleDeleteSubcategory = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la subcategoría?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        })

        if (isConfirmed) {
            try {
                const body = { 'subcategory_Id': id }
                const data: ResponseApi = await postApiData('Subcategory/DeleteSubcategory', body, true, 'application/json');
                const updatedList = subcategories.map( category => {
                    const subcategories: Array<Subcategory> = JSON.parse(category.SubCategories.toString());
                    const filtered = subcategories.filter(subcategory => subcategory.Id !== id);
                    category.SubCategories = JSON.stringify(filtered);
                    return category;
                });
                setSubcategories(updatedList);
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, subcategories, MemoizedTiDelete]);
    
    const subcategoryComponents = useMemo(() => (
        subcategories.map( category => (
            JSON.parse(category.SubCategories.toString()).length > 0 &&
            <div className='card_container' key={category.Id}>
                <h3 className='category_name'>{category.Name}</h3>
                {JSON.parse(category.SubCategories.toString()).map( (subcategory: Subcategory) => (
                    <Card 
                        key={subcategory.Id} 
                        onEdit={() => handleEditSubcategory(subcategory.Id)} 
                        onDelete={() => handleDeleteSubcategory(subcategory.Id)} 
                        type='basic'
                        item={{ name: subcategory.Name }}
                    />
                ))}
            </div>
        ))
    ), [subcategories, handleEditSubcategory, handleDeleteSubcategory]);

    return (
        <div className='page_container'>
            <Header logo={imgSubcategories} title='Subcategorías' />
            <Button name='Agregar Subcategoría' type='button' onClick={handleAddSubcategory} icon='add' template='dark' />

            {subcategoryComponents}
        </div>
    );
}

export { Subcategories };