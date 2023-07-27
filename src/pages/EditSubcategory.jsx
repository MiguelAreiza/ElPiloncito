import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { SubcategoryForm } from '../components/SubcategoryForm'
// Sources
import axios from 'axios';
import imgCategories from '../assets/images/headerOptions/Categories.svg';

function EditSubcategory() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/subcategories',
            option: 'settings'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClicEdit = (id, category, image, name, active) => {        
        setIsLoading(true);
        const formData = new FormData();
        formData.append('Subcategory_Id', id);
        formData.append('Category_Id', category);
        formData.append('Image', image);
        formData.append('Name', name);
        formData.append('Active', active);

        axios.post(`${path}api/Subcategory/UpdateSubcategory`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `bearer ${token}`
            },
            withCredentials: true
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }     
            addToastr(data.rpta);
            navigate('/home/settings/subcategories');
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        }); 
    }

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Subcategorías' />
            <SubcategoryForm onEdit={handleClicEdit} />
        </div>
    );

}

export { EditSubcategory };