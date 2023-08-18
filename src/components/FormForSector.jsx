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

function FormForSector({ onCreate, onEdit }) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [active, setActive] = React.useState(true);
    const MemoizedBsQuestionOctagonFill = React.memo(BsQuestionOctagonFill);

    const getSector = React.useCallback(async () => {
        try {
            const data = await getApiData(`Sector/GetSectorById?Sector_Id=${params.id}`, true);
            setName(data.sector.name);
            setPrice(data.sector.price);
            setActive(data.sector.active);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/sectors');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    React.useEffect(() => {
        if (params.id) {
            getSector();
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
            params.id ? 
                onEdit(params.id, name, price, active) 
            : 
                onCreate(name, price, active);
        }
    }, [params, onEdit, onCreate, name, price, active]);

    const memoizedHandleSubmit = React.useMemo(
        () => handleSubmit,
        [handleSubmit]
    );
    
    return (
        <form className='form_inputs' onSubmit={memoizedHandleSubmit}>
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Precio' type='money' value={price} setValue={setPrice} />
            <Input name='Activo' type='checkbox' value={active} setValue={setActive} /> 

            <Button name={params.id? 'Editar sector' : 'Crear sector'} type='submit' icon='next' />
        </form>
    );
}

export { FormForSector };