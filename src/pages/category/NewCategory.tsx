import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForCategory } from '../../components/FormForCategory';

interface NewCategoryData {
    Name: string
    Active: boolean
}

function NewCategory() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/categories',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleCreateCategory = useCallback(async (category: NewCategoryData) => {
        try {
            const body = {
                'name': category.Name, 
                'active': category.Active 
            };
            const data: ResponseApi = await postApiData('Category/CreateCategory', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/categories');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='categories' title='Nueva Categoría' />
            <FormForCategory onCreate={handleCreateCategory} />
        </div>
    );
}

export { NewCategory };