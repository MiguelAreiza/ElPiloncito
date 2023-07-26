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

function SubcategoryForm({ onCreate, onEdit }) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { path, token } = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [name, setName] = React.useState('');
    const [active, setActive] = React.useState(true);
    const [optsCategory, setOptsCategory] = React.useState([]);

    React.useEffect(() => {
        if (params.id) {
            axios.get(`${path}api/Subcategory/GetSubcategoryById?Subcategory_Id=${params.id}`, {
                headers: {
                    'Authorization': `bearer ${token}`
                }
            }).then( ({data}) => {
                if (data.cod === '-1') {
                    addToastr(data.rpta, 'warning');
                    setIsLoading(false);
                    return;
                }
                setCategory(data.subcategory.category);
                setImage(data.subcategory.imageUrl);
                setName(data.subcategory.name);
                setActive(data.subcategory.active);
                setIsLoading(false);
            }).catch(error => {                    
                addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                navigate('/home/settings/subcategories');
            });  
        }
        
        axios.get(`${path}api/Category/GetCategoriesByUser`, {
            headers: {
                'Authorization': `bearer ${token}`,
            },
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }

            setOptsCategory(data.categories);
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> la subcategoría?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                params.id ? onEdit(params.id, category.value, image, name, active) : onCreate(category.value, image, name, active);
            }
        });
    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input name='Imagen' type='file' value={image} setValue={setImage} accept='image/*' required={false} />
            <Input name='Categoría' type='select' value={category} setValue={setCategory} options={optsCategory} defaultValue={category} /> 
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Subcategoría activa' type='checkbox' value={active} setValue={setActive} />

            <Button name={params.id? 'Editar subcategoría' : 'Crear subcategoría'} type='submit' icon='next' />
        </form>
    );
}

export { SubcategoryForm };