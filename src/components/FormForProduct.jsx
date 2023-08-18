import React from 'react';
import { renderToString } from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Input } from './Input';
import { Button } from './Button';
// Sources
import Swal from 'sweetalert2';

function FormForProduct({ onCreate, onEdit }) {
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [active, setActive] = React.useState(true);
    const [outstanding, setOutstanding] = React.useState(false);
    const [optsSubCategory, setOptsSubcategory] = React.useState([]);
    const MemoizedBsQuestionOctagonFill = React.memo(BsQuestionOctagonFill);

    const getProduct = React.useCallback(async () => {
        try {
            const data = await getApiData(`Product/GetProductById?Product_Id=${params.id}`, true);
            setSubcategory(data.product.subcategory);
            setImage(data.product.imageUrl);
            setName(data.product.name);
            setPrice(data.product.price);
            setDescription(data.product.description);
            setActive(data.product.active);
            setOutstanding(data.product.outstanding);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/products');
        }
    }, [getApiData, params, addToastr, navigate]);

    const getSubcategories = React.useCallback(async () => {
        if (optsSubCategory.length !== 0) {
            return;
        }
        try {
            const data = await getApiData('Subcategory/GetSubcategoriesByUser', true);
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }                            
            setOptsSubcategory(data.subcategories);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsSubCategory, addToastr, getApiData])

    React.useEffect(() => {
        getSubcategories();
        if (params.id) {
            getProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = React.useCallback(async (e) => {
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
            params.id ? 
                onEdit(params.id, subcategory.value, image, name, price, description, active, outstanding) 
            : 
                onCreate(subcategory.value, image, name, price, description, active, outstanding);
        }
    }, [params, onEdit, onCreate, subcategory, image, name, price, description, active, outstanding]);

    const memoizedHandleSubmit = React.useMemo(
        () => handleSubmit,
        [handleSubmit]
    );

    return (
        <form className='form_inputs' onSubmit={memoizedHandleSubmit}>
            <Input name='Imagen' type='file' value={image} setValue={setImage} accept='image/*' required={false}  />
            <Input name='Subcategoría' type='select' value={subcategory} setValue={setSubcategory} options={optsSubCategory} defaultValue={subcategory} /> 
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Descripción' type='text' value={description} setValue={setDescription} />
            <Input name='Precio' type='money' value={price} setValue={setPrice} />
            <Input name='Producto destacado' type='checkbox' value={outstanding} setValue={setOutstanding} /> 
            <Input name='Producto activo' type='checkbox' value={active} setValue={setActive} /> 

            <Button name={params.id? 'Editar producto' : 'Crear producto'} type='submit' icon='next' />
        </form>
    );
}

export { FormForProduct };