import React from 'react';
import { Link } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Activities.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';

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
                <Link className='activity_option' to='/home/activities/orders' onClick={handleClickOpt} >
                    Ordenes
                </Link>
            </div>
        </div>
    );
}

export { Activities };