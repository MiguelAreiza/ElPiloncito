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
import imgWaiter from '../assets/images/actions/Waiter.svg';
import imgCashier from '../assets/images/actions/Cashier.svg';

function Actions() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const actionOptions = [
        {to:'/home/actions/takeOrder', name:'Tomar pedido', image: imgWaiter, alt:'imagen de camarero'},
        {to:'/home/actions/pendingOrders', name:'Pedidos', image: imgCashier, alt:'imagen de cajero'}
    ];

    React.useEffect(() => {
        setMenuConfig(() => ({
            option: 'actions'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOpt = React.useCallback(() => {
        setIsLoading(true);
    }, [setIsLoading]);
    
    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='ACCIONES' />
            
            <div className='container_actions_options'>
                {actionOptions.map((option, index) => (
                    <Link key={index} className='actions_option' to={option.to} onClick={handleClickOpt}>
                        <img src={option.image} alt={option.alt} />
                        {option.name}
                        <SlArrowRight size={25} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export { Actions };