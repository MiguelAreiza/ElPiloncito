import React from 'react';
import { renderToString } from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Input } from './Input';
import { Button } from './Button';
// Sources
import Swal from 'sweetalert2';
import axios from 'axios';

function ProductForm({ onCreate, onEdit }) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { path, token } = useAuth();
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

    React.useEffect(() => {
        if (params.id) {
            axios.get(`${path}api/Product/GetProductById?Product_Id=${params.id}`, {
                headers: {
                    'Authorization': `bearer ${token}`
                },
                withCredentials: true
            }).then( ({data, data:{product}}) => {
                if (data.cod === '-1') {
                    addToastr(data.rpta, 'warning');
                    setIsLoading(false);
                    return;
                }
                setSubcategory(product.subcategory);
                setImage(product.imageUrl);
                setName(product.name);
                setPrice(product.price);
                setDescription(product.description);
                setActive(product.active);
                setOutstanding(product.outstanding);                 
                setIsLoading(false);
            }).catch(error => {                    
                addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                navigate('/home/settings/products');
            });  
        }
        
        axios.get(`${path}api/Subcategory/GetSubcategoriesByUser`, {
            headers: {
                'Authorization': `bearer ${token}`,
            },
            withCredentials: true
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }
            
            setOptsSubcategory(data.subcategories);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = e => {
        e.preventDefault();
        Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> el producto?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                params.id ? 
                    onEdit(params.id, subcategory.value, image, name, price, description, active, outstanding) 
                : 
                    onCreate(subcategory.value, image, name, price, description, active, outstanding);
            }
        });
    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
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

export { ProductForm };