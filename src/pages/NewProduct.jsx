import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { ProductForm } from '../components/ProductForm';
// Sources
import axios from 'axios';
import imgProducts from '../assets/images/headerOptions/Products.svg';

function NewProduct() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/products',
            option: 'settings'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (subcategory, image, name, price, description, active, outstanding) => {        
        setIsLoading(true);        
        const formData = new FormData();
        formData.append('Subcategory_Id', subcategory);
        formData.append('Image', image);
        formData.append('Name', name);
        formData.append('Price', price.replace('$ ','').replace(',',''));
        formData.append('Description', description);
        formData.append('Active', active);
        formData.append('Outstanding', outstanding);

        axios.post(`${path}api/Product/CreateProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `bearer ${token}`
            }
        }).then( ({data}) => {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }                  
            addToastr(data.rpta);
            navigate('/home/settings/products');         
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        }); 
    }

    return (
        <div className='page_container'>
            <Header logo={imgProducts} title='Productos' />
            <ProductForm onCreate={handleClickCreate} />
        </div>
    );
}

export { NewProduct };