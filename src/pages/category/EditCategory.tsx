import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForCategory } from '../../components/FormForCategory'

interface EditCategoryData {
    Category_Id: string
    Name: string
    Active: boolean
}

function EditCategory() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/categories',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleEditCategory = useCallback(async (category: EditCategoryData) => {
        try {
            const body = { 
                'category_Id': category.Category_Id, 
                'name': category.Name, 
                'active': category.Active 
            };
            const data: ResponseApi = await postApiData('Category/UpdateCategory', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/categories');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='categories' title='Editar Categoría' />
            <FormForCategory onEdit={handleEditCategory} />
        </div>
    );
}

export { EditCategory };