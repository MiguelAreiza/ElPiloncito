import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Accounting.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgIncome from '../assets/images/icons/Income.svg';
import imgExpenses from '../assets/images/icons/Expenses.svg';
import imgCashRegister from '../assets/images/icons/CashRegister.svg';

function Accounting() {
    const { setIsLoading, setMenuConfig,  } = useAppStates();
    const [showMovements, setShowMovements] = useState(false);

    useEffect(() => {
        setMenuConfig({
            option: 'accounting'
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickTo = useCallback(() => {
        setIsLoading(true);
    }, [setIsLoading])

    const handleShowMovements = useCallback(() => {
        setShowMovements(!showMovements);
    }, [showMovements]);

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='CONTABILIDAD'/>
            
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
                <div className='base'>
                    <h3>Base</h3>
                    $ 500.000
                </div>
                <div className='expenses'>
                    <h3>Egresos</h3>
                    $ 700.000
                </div>
                <button className='see_movements' onClick={handleShowMovements}>
                    Ver movimientos
                </button>
            </div>

            <div className={`movements ${showMovements ? 'active' : ''}`}>
                <div className='titles'>
                    <h2>Ingresos</h2>
                    <h2>Egresos</h2>
                </div>
                <div className='container_movements'>
                    <div className='movement_income'>
                        <span className='movement_amount'>$ 200.000</span>
                        <span className='movement_date'>{new Date().toLocaleString()}</span>
                    </div>
                    <div className='movement_expenses'>
                        <span className='movement_amount'>$ -200.000</span>
                        <span className='movement_date'>{new Date().toLocaleString()}</span>
                    </div>
                    <div className='movement_income'>
                        <span className='movement_amount'>$ 200.000</span>
                        <span className='movement_date'>{new Date().toLocaleString()}</span>
                    </div>
                    <div className='movement_expenses'>
                        <span className='movement_amount'>$ -200.000</span>
                        <span className='movement_date'>{new Date().toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    );
}

export { Accounting };