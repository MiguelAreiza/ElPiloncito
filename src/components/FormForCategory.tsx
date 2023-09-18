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

interface NewCategoryData {
    Name: string
    Active: boolean
}

interface EditCategoryData {
    Category_Id: string
    Name: string
    Active: boolean
}

interface Props {
    onCreate?: (category: NewCategoryData) => Promise<void>
    onEdit?: (category: EditCategoryData) => Promise<void>
}

function FormForCategory({ onCreate, onEdit }: Props) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getCategory = useCallback(async () => {
        try {
            const data = await getApiData(`Category/GetCategoryById?Category_Id=${params.id}`, true);
            setName(data.category.name);
            setActive(data.category.active);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/categories');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    useEffect(() => {
        if (params.id) {
            getCategory();
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> la categoría?</div>`,
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
                const category: EditCategoryData = {
                    'Category_Id': params.id,
                    'Name': name,
                    'Active': active
                }
                if (onEdit) onEdit(category);
            } else {
                const category: NewCategoryData = {
                    'Name': name,
                    'Active': active
                }
                if (onCreate) onCreate(category);
            }
        }
    }, [params, onEdit, onCreate, name, active, MemoizedBsQuestionOctagonFill]);
    
    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='checkbox' value={active} setValue={setActive} name='Categoría activa' /> 

            <Button name={params.id? 'Editar categoría' : 'Crear categoría'} type='submit' icon='next' />
        </form>
    );
}

export { FormForCategory };