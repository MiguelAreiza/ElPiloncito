import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForProduct } from '../../components/FormForProduct'
// Sources
import imgProducts from '../../assets/images/headerOptions/Products.svg';

function EditProduct() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/Products',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditProduct = React.useCallback(async (id, subcategory, image, name, price, description, active, outstanding) => {
        try {
            const body = new FormData();
            body.append('Product_Id', id);
            body.append('Subcategory_Id', subcategory);
            body.append('Image', image);
            body.append('Name', name);
            body.append('Price', price.replace('$ ','').replace(',',''));
            body.append('Description', description);
            body.append('Active', active);
            body.append('Outstanding', outstanding);
            const data = await postApiData('Product/UpdateProduct', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/products');
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleEditProduct = React.useMemo(
        () => (id, subcategory, image, name, price, description, active, outstanding) => handleEditProduct(id, subcategory, image, name, price, description, active, outstanding),
        [handleEditProduct]
    );

    return (
        <div className='page_container'>
            <Header logo={imgProducts} title='Productos' />
            <FormForProduct onEdit={memoizedHandleEditProduct} />
        </div>
    );
}

export { EditProduct };