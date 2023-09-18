import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
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

interface NewSectorData {
    Name: string
    Price: string
    Active: boolean
}

interface EditSectorData {
    Sector_Id: string
    Name: string
    Price: string
    Active: boolean
}

interface Props {
    onCreate?: (sector: NewSectorData) => Promise<void>
    onEdit?: (sector: EditSectorData) => Promise<void>
}

function FormForSector({ onCreate, onEdit }: Props) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getSector = useCallback(async () => {
        try {
            const data = await getApiData(`Sector/GetSectorById?Sector_Id=${params.id}`, true);
            setName(data.sector.name);
            setPrice(data.sector.price);
            setActive(data.sector.active);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/sectors');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    useEffect(() => {
        if (params.id) {
            getSector();
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> el sector?</div>`,
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
                const sector: EditSectorData = {
                    'Sector_Id': params.id,
                    'Name': name,
                    'Price': price,
                    'Active': active
                }
                if (onEdit) onEdit(sector);
            } else {
                const sector: NewSectorData = {
                    'Name': name,
                    'Price': price,
                    'Active': active
                }
                if (onCreate) onCreate(sector);
            }
        }
    }, [params, onEdit, onCreate, name, price, active, MemoizedBsQuestionOctagonFill]);

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='money' value={price} setValue={setPrice} name='Precio' />
            <Input type='checkbox' value={active} setValue={setActive} name='Activo' /> 

            <Button name={params.id? 'Editar sector' : 'Crear sector'} type='submit' icon='next' />
        </form>
    );
}

export { FormForSector };