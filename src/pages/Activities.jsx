import React from 'react';
import { Link } from 'react-router-dom';
import { SlArrowRight } from 'react-icons/sl';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Activities.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgWaiter from '../assets/images/Activities/Waiter.svg';
import imgCashier from '../assets/images/Activities/Cashier.svg';

function Activities() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            option: 'activities'
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
            <Header logo={imgLogo} title='ACTIVIDADES' />
            
            <div className="container_activities">
                <Link className='activity_option' to='/home/activities/takeOrder' onClick={handleClickOpt} >
                    <img src={imgWaiter} alt="imagen de camarero" />
                    Tomar pedido
                    <SlArrowRight size={25}  />
                </Link>                
                <Link className='activity_option' to='/home/activities/racordPayment' onClick={handleClickOpt} >
                    <img src={imgCashier} alt="imagen de cajero" />
                    Registrar pago
                    <SlArrowRight size={25}  />
                </Link>
            </div>
        </div>
    );
}

export { Activities };