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

function FormForTable({ onCreate, onEdit }) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [capacity, setCapacity] = React.useState(1);
    const [available, setAvailable] = React.useState(true);
    const MemoizedBsQuestionOctagonFill = React.memo(BsQuestionOctagonFill);

    const getTable = React.useCallback(async () => {
        try {
            const data = await getApiData(`Table/GetTableById?Table_Id=${params.id}`, true);
            setName(data.table.name);
            setCapacity(data.table.capacity);
            setAvailable(data.table.available);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/tables');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    React.useEffect(() => {
        if (params.id) {
            getTable();
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = React.useCallback(async (e) => {
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
            params.id ? 
                onEdit(params.id, name, capacity, available) 
            : 
                onCreate(name, capacity, available);
        }
    }, [params, onEdit, onCreate, name, capacity, available]);

    const memoizedHandleSubmit = React.useMemo(
        () => handleSubmit,
        [handleSubmit]
    );
    
    return (
        <form className='form_inputs' onSubmit={memoizedHandleSubmit}>
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Capacidad' type='number' value={capacity} setValue={ setCapacity} />
            <Input name='Mesa disponible' type='checkbox' value={available} setValue={setAvailable} /> 

            <Button name={params.id? 'Editar mesa' : 'Crear mesa'} type='submit' icon='next' />
        </form>
    );
}

export { FormForTable };