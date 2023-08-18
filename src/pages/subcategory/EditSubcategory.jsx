import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForSubcategory } from '../../components/FormForSubcategory'
// Sources
import imgCategories from '../../assets/images/headerOptions/Categories.svg';

function EditSubcategory() {    
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

    const handleEditSubcategory = React.useCallback(async (id, category, image, name, active) => {
        try {
            const body = new FormData();
            body.append('Subcategory_Id', id);
            body.append('Category_Id', category);
            body.append('Image', image);
            body.append('Name', name);
            body.append('Active', active);
            const data = await postApiData('Subcategory/UpdateSubcategory', body, true, 'multipart/form-data');            
            addToastr(data.rpta);
            navigate('/home/settings/subcategories');
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleEditSubcategory = React.useMemo(
        () => (id, category, image, name, active) => handleEditSubcategory(id, category, image, name, active),
        [handleEditSubcategory]
    );

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Subcategorías' />
            <FormForSubcategory onEdit={memoizedHandleEditSubcategory} />
        </div>
    );
}

export { EditSubcategory };