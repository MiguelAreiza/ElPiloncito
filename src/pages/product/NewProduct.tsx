import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForProduct } from '../../components/FormForProduct';

interface NewProductData {
    Subcategory: string
    Image: string
    Name: string
    Price: number | string
    Description: string
    Active: boolean
    Outstanding: boolean
}

function NewProduct() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/products',
            option: 'settings'
        });
    }, [setMenuConfig]);
    
    const handleCreateProduct = useCallback(async (product: NewProductData) => {
        try {
            const body = new FormData();
            body.append('Subcategory_Id', product.Subcategory);
            body.append('Image', product.Image!);
            body.append('Name', product.Name);
            body.append('Price', product.Price.toString().replace('$ ','').replace(',',''));
            body.append('Description', product.Description);
            body.append('Active', product.Active.toString());
            body.append('Outstanding', product.Outstanding.toString());
            const data: ResponseApi = await postApiData('Product/CreateProduct', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/products');  
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='products' title='Nuevo Producto' />
            <FormForProduct onCreate={handleCreateProduct} />
        </div>
    );
}

export { NewProduct };