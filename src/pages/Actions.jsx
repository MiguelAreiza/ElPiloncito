import React from 'react';
import { Link } from 'react-router-dom';
import { SlArrowRight } from 'react-icons/sl';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Actions.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgWaiter from '../assets/images/Actions/Waiter.svg';
import imgCashier from '../assets/images/Actions/Cashier.svg';

function Actions() {
    const { setIsLoading, setMenuConfig } = useAppStates();

    React.useEffect(() => {
        setMenuConfig(() => ({
            option: 'actions'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOpt = () => {
        setIsLoading(true);
    }

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='ACCIONES' />
            
            <div className="container_actions">
                <Link className='actions_option' to='/home/actions/takeOrder' onClick={handleClickOpt} >
                    <img src={imgWaiter} alt="imagen de camarero" />
                    Tomar pedido
                    <SlArrowRight size={25}  />
                </Link>                
                <Link className='actions_option' to='/home/actions/pendingOrders' onClick={handleClickOpt} >
                    <img src={imgCashier} alt="imagen de cajero" />
                    Pedidos pendientes
                    <SlArrowRight size={25}  />
                </Link>
            </div>
        </div>
    );
}

export { Actions };