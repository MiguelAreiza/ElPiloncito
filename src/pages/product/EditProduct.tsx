import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForProduct } from '../../components/FormForProduct'
// Sources
import imgProducts from '../../assets/images/headerOptions/Products.svg';

interface EditProductData {
    Product_Id: string
    Subcategory: string
    Image: string
    Name: string
    Price: number | string
    Description: string
    Active: boolean
    Outstanding: boolean
}

function EditProduct() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/Products',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleEditProduct = useCallback(async (product: EditProductData) => {
        try {
            const body = new FormData();
            body.append('Product_Id', product.Product_Id);
            body.append('Subcategory_Id', product.Subcategory);
            body.append('Image', product.Image!);
            body.append('Name', product.Name);
            body.append('Price', product.Price.toString().replace('$ ','').replace(',',''));
            body.append('Description', product.Description);
            body.append('Active', product.Active.toString());
            body.append('Outstanding', product.Outstanding.toString());
            const data: ResponseApi = await postApiData('Product/UpdateProduct', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/products');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <Header logo={imgProducts} title='Productos' />
            <FormForProduct onEdit={handleEditProduct} />
        </div>
    );
}

export { EditProduct };