import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForCategory } from '../../components/FormForCategory'
// Sources
import imgCategories from '../../assets/images/headerOptions/Categories.svg';

function EditCategory() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/categories',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditCategory = React.useCallback(async (id, name, active) => {
        try {
            const body = { 
                'category_Id': id, 
                'name': name, 
                'active': active 
            };
            const data = await postApiData('Category/UpdateCategory', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/categories');
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleEditCategory = React.useMemo(
        () => (id, name, active) => handleEditCategory(id, name, active),
        [handleEditCategory]
    );

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Categorías' />
            <FormForCategory onEdit={memoizedHandleEditCategory} />
        </div>
    );
}

export { EditCategory };