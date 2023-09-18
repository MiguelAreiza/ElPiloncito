import { memo, useCallback, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { useAppStates } from '../helpers/states';
import { transformToOptions } from '../helpers/functions';
import { useApi } from '../helpers/api';
import { Input } from './Input';
import { Button } from './Button';
// Sources
import Swal from 'sweetalert2';

interface NewProductData {
    Subcategory: string
    Image: string
    Name: string
    Price: number | string
    Description: string
    Active: boolean
    Outstanding: boolean
}

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

interface Props {
    onCreate?: (product: NewProductData) => Promise<void>
    onEdit?: (product: EditProductData) => Promise<void>
}

interface Subcategory {
    Id: string
    Name: string
}

interface GetSubcategoriesData {
    subcategories: Array<Subcategory>;
    cod: string;
}

function FormForProduct({ onCreate, onEdit }: Props) {
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState<any>('');
    const [image, setImage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number | string>('');
    const [description, setDescription] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    const [outstanding, setOutstanding] = useState<boolean>(false);
    const [optsSubCategory, setOptsSubcategory] = useState<Array<Subcategory>>([]);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getProduct = useCallback(async () => {
        try {
            const data = await getApiData(`Product/GetProductById?Product_Id=${params.id}`, true);
            setSubcategory(data.product.subcategory);
            setImage(data.product.imageUrl);
            setName(data.product.name);
            setPrice(data.product.price);
            setDescription(data.product.description);
            setActive(data.product.active);
            setOutstanding(data.product.outstanding);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/products');
        }
    }, [getApiData, params, addToastr, navigate]);

    const getSubcategories = useCallback(async () => {
        if (optsSubCategory.length !== 0) {
            return;
        }
        try {
            const data: GetSubcategoriesData = await getApiData('Subcategory/GetSubcategoriesByUser', true);
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }                            
            setOptsSubcategory(data.subcategories);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsSubCategory, addToastr, getApiData])

    useEffect(() => {
        getSubcategories();
        if (params.id) {
            getProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> el producto?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            if (params.id) {
                const product: EditProductData = {
                    'Product_Id': params.id,
                    'Subcategory': subcategory.value,
                    'Image': image,
                    'Name': name,
                    'Price': price,
                    'Description': description,
                    'Active': active,
                    'Outstanding': outstanding
                }
                if (onEdit) onEdit(product);
            } else {                
                const product: NewProductData = {
                    'Subcategory': subcategory.value,
                    'Image': image,
                    'Name': name,
                    'Price': price,
                    'Description': description,
                    'Active': active,
                    'Outstanding': outstanding
                }
                if (onCreate) onCreate(product);
            }
        }
    }, [params, onEdit, onCreate, subcategory, image, name, price, description, active, outstanding, MemoizedBsQuestionOctagonFill]);

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='photo' value={image} setValue={setImage} name='Imagen' required={false}  />
            <Input type='select' value={subcategory} setValue={setSubcategory} name='Subcategoría' options={transformToOptions(optsSubCategory)} defaultValue={subcategory} /> 
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='text' value={description} setValue={setDescription} name='Descripción' />
            <Input type='money' value={price} setValue={setPrice} name='Precio' />
            <Input type='checkbox' value={outstanding} setValue={setOutstanding} name='Producto destacado' /> 
            <Input type='checkbox' value={active} setValue={setActive} name='Producto activo' /> 

            <Button name={params.id? 'Editar producto' : 'Crear producto'} type='submit' icon='next' />
        </form>
    );
}

export { FormForProduct };