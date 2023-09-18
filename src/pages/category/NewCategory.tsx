import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForCategory } from '../../components/FormForCategory';
// Sources
import imgCategories from '../../assets/images/headerOptions/Categories.svg';

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
            <Header logo={imgCategories} title='Categoría' />
            <FormForCategory onCreate={handleCreateCategory} />
        </div>
    );
}

export { NewCategory };