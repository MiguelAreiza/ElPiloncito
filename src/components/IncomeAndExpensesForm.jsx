import React from 'react';
import { useLocation } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Input } from './Input';
import { Button } from './Button';
// Sources

function IncomeAndExpensesForm() {
    const { setIsLoading, setOpenModal } = useAppStates();
    const location = useLocation();
    const [name, setName] = React.useState('');
    const [active, setActive] = React.useState(true);

    React.useEffect(() => {
        console.log(location);
        setTimeout(() => {
            setOpenModal(true);
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <form className='form_inputs'>
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Categoría activa' type='checkbox' value={active} setValue={setActive} /> 

            <Button name={`Registrar`} type='submit' icon='next' />
        </form>
    );
}

export { IncomeAndExpensesForm };