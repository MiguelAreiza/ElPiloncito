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

function FormForSubcategory({ onCreate, onEdit }) {    
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [image, setImage] = React.useState(null);
    const [category, setCategory] = React.useState('');
    const [name, setName] = React.useState('');
    const [active, setActive] = React.useState(true);
    const [optsCategory, setOptsCategory] = React.useState([]);
    const MemoizedBsQuestionOctagonFill = React.memo(BsQuestionOctagonFill);

    const getSubcategory = React.useCallback(async () => {
        try {
            const data = await getApiData(`Subcategory/GetSubcategoryById?Subcategory_Id=${params.id}`, true);
            setCategory(data.subcategory.category);
            setImage(data.subcategory.imageUrl);
            setName(data.subcategory.name);
            setActive(data.subcategory.active);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/subcategories');
        }
    }, [getApiData, params, addToastr, navigate]);

    const getCategories = React.useCallback(async () => {
        if (optsCategory.length !== 0) {
            return;
        }
        try {
            const data = await getApiData('Category/GetCategoriesByUser', true);
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }                            
            setOptsCategory(data.categories);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsCategory, addToastr, getApiData]);

    React.useEffect(() => {
        getCategories();
        if (params.id) {
            getSubcategory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = React.useCallback(async (e) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> la subcategoría?</div>`,
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
                onEdit(params.id, category.value, image, name, active) 
            : 
                onCreate(category.value, image, name, active);
        }
    }, [params, onEdit, onCreate, category, image, name, active]);

    const memoizedHandleSubmit = React.useMemo(
        () => handleSubmit,
        [handleSubmit]
    );

    return (
        <form className='form_inputs' onSubmit={memoizedHandleSubmit}>
            <Input name='Imagen' type='file' value={image} setValue={setImage} accept='image/png, image/jpg, image/jpeg' required={false} />
            <Input name='Categoría' type='select' value={category} setValue={setCategory} options={optsCategory} defaultValue={category} /> 
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Subcategoría activa' type='checkbox' value={active} setValue={setActive} />

            <Button name={params.id? 'Editar subcategoría' : 'Crear subcategoría'} type='submit' icon='next' />
        </form>
    );
}

export { FormForSubcategory };