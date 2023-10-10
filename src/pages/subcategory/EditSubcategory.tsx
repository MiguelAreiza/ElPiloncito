import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForSubcategory } from '../../components/FormForSubcategory';

interface EditSubcategoryData {
    Subcategory_Id: string
    Category: string | Array<any>
    Image: string
    Name: string
    Active: boolean
}

function EditSubcategory() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/subcategories',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleEditSubcategory = useCallback(async (subcategory: EditSubcategoryData) => {
        try {
            const body = new FormData();
            body.append('Subcategory_Id', subcategory.Subcategory_Id);
            body.append('Category_Id', subcategory.Category.toString());
            body.append('Image', subcategory.Image!);
            body.append('Name', subcategory.Name);
            body.append('Active', subcategory.Active.toString());
            const data: ResponseApi = await postApiData('Subcategory/UpdateSubcategory', body, true, 'multipart/form-data');            
            addToastr(data.rpta);
            navigate('/home/settings/subcategories');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='subcategories' title='Editar Subcategoría' />
            <FormForSubcategory onEdit={handleEditSubcategory} />
        </div>
    );
}

export { EditSubcategory };