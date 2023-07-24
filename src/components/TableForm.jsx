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

function TableForm({ onCreate, onEdit }) {    
    const { setIsLoading, addToastr } = useAppStates();
    const { path, token } = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [capacity, setCapacity] = React.useState(1);
    const [available, setAvailable] = React.useState(true);

    React.useEffect(() => {
        if (params.id) {
            axios.get(`${path}api/Table/GetTableById?Table_Id=${params.id}`, {
                headers: {
                    'Authorization': `bearer ${token}`
                }
            }).then( ({data}) => {
                if (data.cod === '-1') {
                    addToastr(data.rpta, 'warning');
                    setIsLoading(false);
                    return;
                }
                setName(data.table.name);
                setCapacity(data.table.capacity);
                setAvailable(data.table.available);
                setIsLoading(false);
            }).catch(error => {                    
                addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                navigate('/home/settings/categories');
            });  
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = e => {
        e.preventDefault();
        Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> la mesa?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                params.id ? onEdit(params.id, name, capacity, available) : onCreate(name, capacity, available);
            }
        });
    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Capacidad' type='number' value={capacity} setValue={ setCapacity} />
            <Input name='Mesa disponible' type='checkbox' value={available} setValue={setAvailable} /> 

            <Button name={params.id? 'Editar mesa' : 'Crear mesa'} type='submit' icon='next' />
        </form>
    );
}

export { TableForm };