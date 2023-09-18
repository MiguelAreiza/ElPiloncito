import { memo, useCallback, useEffect, useState } from 'react';
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
import { transformToOptions } from '../helpers/functions';

interface NewSubcategoryData {
    Category: string | Array<any>
    Image: string
    Name: string
    Active: boolean
}

interface EditSubcategoryData {
    Subcategory_Id: string
    Category: string | Array<any>
    Image: string
    Name: string
    Active: boolean
}

interface Props {
    onCreate?: (sector: NewSubcategoryData) => Promise<void>
    onEdit?: (sector: EditSubcategoryData) => Promise<void>
}

interface Category {
    Id: string
    Name: string
}

interface GetCategoriesData {
    categories: Array<Category>;
    cod: string;
}

function FormForSubcategory({ onCreate, onEdit }: Props) {    
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState<string>('');
    const [category, setCategory] = useState<any>('');
    const [name, setName] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    const [optsCategory, setOptsCategory] = useState<Array<Category>>([]);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getSubcategory = useCallback(async () => {
        try {
            const data = await getApiData(`Subcategory/GetSubcategoryById?Subcategory_Id=${params.id}`, true);
            setCategory(data.subcategory.category);
            setImage(data.subcategory.imageUrl);
            setName(data.subcategory.name);
            setActive(data.subcategory.active);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/subcategories');
        }
    }, [getApiData, params, addToastr, navigate]);

    const getCategories = useCallback(async () => {
        if (optsCategory.length !== 0) {
            return;
        }
        try {
            const data: GetCategoriesData = await getApiData('Category/GetCategoriesByUser', true);
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }                            
            setOptsCategory(data.categories);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsCategory, addToastr, getApiData]);

    useEffect(() => {
        getCategories();
        if (params.id) {
            getSubcategory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
            if (params.id) {
                const subcategory: EditSubcategoryData = {
                    'Subcategory_Id': params.id,
                    'Category': category.value,
                    'Image': image,
                    'Name': name,
                    'Active': active
                }
                if (onEdit) onEdit(subcategory);
            } else {                
                const subcategory: NewSubcategoryData = {
                    'Category': category.value,
                    'Image': image,
                    'Name': name,
                    'Active': active
                }
                if (onCreate) onCreate(subcategory);
            }
        }
    }, [params, onEdit, onCreate, category, image, name, active, MemoizedBsQuestionOctagonFill]);

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='photo' value={image} setValue={setImage} name='Imagen' required={false} />
            <Input type='select' value={category} setValue={setCategory} name='Categoría' options={transformToOptions(optsCategory)} defaultValue={category} /> 
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='checkbox' value={active} setValue={setActive} name='Subcategoría activa' />

            <Button name={params.id? 'Editar subcategoría' : 'Crear subcategoría'} type='submit' icon='next' />
        </form>
    );
}

export { FormForSubcategory };