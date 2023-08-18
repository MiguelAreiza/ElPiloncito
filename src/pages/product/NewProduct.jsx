import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForProduct } from '../../components/FormForProduct';
// Sources
import imgProducts from '../../assets/images/headerOptions/Products.svg';

function NewProduct() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/products',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleCreateProduct = React.useCallback(async (subcategory, image, name, price, description, active, outstanding) => {
        try {
            const body = new FormData();
            body.append('Subcategory_Id', subcategory);
            body.append('Image', image);
            body.append('Name', name);
            body.append('Price', price.replace('$ ','').replace(',',''));
            body.append('Description', description);
            body.append('Active', active);
            body.append('Outstanding', outstanding);
            const data = await postApiData('Product/CreateProduct', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/products');  
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleCreateProduct = React.useMemo(
        () => (subcategory, image, name, price, description, active, outstanding) => handleCreateProduct(subcategory, image, name, price, description, active, outstanding),
        [handleCreateProduct]
    );

    return (
        <div className='page_container'>
            <Header logo={imgProducts} title='Productos' />
            <FormForProduct onCreate={memoizedHandleCreateProduct} />
        </div>
    );
}

export { NewProduct };