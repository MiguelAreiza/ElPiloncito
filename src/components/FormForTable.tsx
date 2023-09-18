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

interface NewTableData {
    Name: string
    Capacity: number
    Available: boolean
}

interface EditTableData {
    Table_Id: string
    Name: string
    Capacity: number
    Available: boolean
}

interface Props {
    onCreate?: (table: NewTableData) => Promise<void>
    onEdit?: (table: EditTableData) => Promise<void>
}

function FormForTable({ onCreate, onEdit }: Props) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [capacity, setCapacity] = useState<number>(1);
    const [available, setAvailable] = useState<boolean>(true);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getTable = useCallback(async () => {
        try {
            const data = await getApiData(`Table/GetTableById?Table_Id=${params.id}`, true);
            setName(data.table.name);
            setCapacity(data.table.capacity);
            setAvailable(data.table.available);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/tables');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    useEffect(() => {
        if (params.id) {
            getTable();
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> la mesa?</div>`,
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
                const table: EditTableData = {
                    'Table_Id': params.id,
                    'Name': name,
                    'Capacity': capacity,
                    'Available': available
                }
                if (onEdit) onEdit(table);
            } else {
                const table: NewTableData = {
                    'Name': name,
                    'Capacity': capacity,
                    'Available': available
                }
                if (onCreate) onCreate(table);
            }
        }
    }, [params, onEdit, onCreate, name, capacity, available, MemoizedBsQuestionOctagonFill]);
    
    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='number' value={capacity} setValue={ setCapacity} name='Capacidad' />
            <Input type='checkbox' value={available} setValue={setAvailable} name='Mesa disponible' /> 

            <Button name={params.id? 'Editar mesa' : 'Crear mesa'} type='submit' icon='next' />
        </form>
    );
}

export { FormForTable };