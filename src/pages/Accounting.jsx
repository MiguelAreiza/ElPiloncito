import React from 'react';
import { Link, Outlet } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
// Styles
import '../styles/Accounting.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgIncome from '../assets/images/icons/Income.svg';
import imgExpenses from '../assets/images/icons/Expenses.svg';
import imgCashRegister from '../assets/images/icons/CashRegister.svg';

function Accounting() {
    const { setIsLoading, setMenuConfig,  } = useAppStates();
    const [openModal, setOpenModal] = React.useState(false);

    React.useEffect(() => {
        setMenuConfig(() => ({
            option: 'accounting'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickTo = React.useCallback(() => {
        setIsLoading(true);
        setOpenModal(true);
    }, [setIsLoading])

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='CONTABILIDAD' />
            
            <div className='accounting_actions'>
                <Link to='income' onClick={handleClickTo}>
                    <img src={imgIncome} alt='Income icon' width='45px' height='45px' />
                </Link>

                <button className='cash_register'>
                    <img src={imgCashRegister} alt='Cash register icon' />
                </button>

                <Link to='expenses' onClick={handleClickTo}>
                    <img src={imgExpenses} alt='Expenses icon' width='45px' height='45px' />
                </Link>
            </div>

            <div className='income_and_expenses'>
                <div className='income'>
                    <h3>Ingresos</h3>
                    $ 3'500.000
                </div>
                <div className='expenses'>
                    <h3>Egresos</h3>
                    $ 700.000
                </div>
                <button className='see_movements'>Ver movimientos</button>
            </div>

            <Modal closeUrl='/home/accounting' isOpen={openModal} setIsOpen={setOpenModal}> <Outlet /> </Modal>
        </div>
    );
}

export { Accounting };