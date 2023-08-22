import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForSubcategory } from '../../components/FormForSubcategory';
// Sources
import imgCategories from '../../assets/images/headerOptions/Categories.svg';

function NewSubcategory() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/subcategories',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateSubcategory = React.useCallback(async (category, image, name, active) => {
        try {            
            const body = new FormData();
            body.append('Category_Id', category);
            body.append('Image', image);
            body.append('Name', name);
            body.append('Active', active);
            const data = await postApiData('Subcategory/CreateSubcategory', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/subcategories');   
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleCreateSubcategory = React.useMemo(
        () => (category, image, name, active) => handleCreateSubcategory(category, image, name, active),
        [handleCreateSubcategory]
    );

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Subcategorías' />
            <FormForSubcategory onCreate={memoizedHandleCreateSubcategory} />
        </div>
    );
}

export { NewSubcategory };