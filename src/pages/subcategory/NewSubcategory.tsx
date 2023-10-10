import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForSubcategory } from '../../components/FormForSubcategory';

interface NewSubcategoryData {
    Category: string | Array<any>
    Image: string
    Name: string
    Active: boolean
}

function NewSubcategory() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/subcategories',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleCreateSubcategory = useCallback(async (subcategory: NewSubcategoryData) => {
        try {            
            const body = new FormData();
            body.append('Category_Id', subcategory.Category.toString());
            body.append('Image', subcategory.Image!);
            body.append('Name', subcategory.Name);
            body.append('Active', subcategory.Active.toString());
            const data: ResponseApi = await postApiData('Subcategory/CreateSubcategory', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/subcategories');   
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='subcategories' title='Nueva Subcategoría' />
            <FormForSubcategory onCreate={handleCreateSubcategory} />
        </div>
    );
}

export { NewSubcategory };