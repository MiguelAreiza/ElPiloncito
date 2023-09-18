import React from 'react';
import { useLocation } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
// Sources

function IncomeAndExpensesForm() {
    const { setIsLoading } = useAppStates();
    const [openModal, setOpenModal] = React.useState(false);
    const location = useLocation();
    const [price, setPrice] = React.useState('');
    const [remarks, setRemarks] = React.useState('');
    const urlName = location.pathname.split('/')[location.pathname.split('/').length -1];
    const urlSName = urlName === 'income' ? 'Ingreso' : 'Egreso'

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
            setOpenModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/accounting' name={`Registrar ${urlSName}`}>
            <form className='form_inputs'>
                <Input type='money' value={price} setValue={setPrice} name='Precio' />
                <Input type='textarea' value={remarks} setValue={setRemarks} name='Descripción' /> 

                <Button name={`Registrar ${urlSName}`} type='submit' icon='next' />
            </form>
        </Modal>
    );
}

export { IncomeAndExpensesForm };