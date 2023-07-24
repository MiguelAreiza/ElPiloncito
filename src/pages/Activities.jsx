import React from 'react';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { SlArrowRight } from 'react-icons/sl';

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
                <Link className='config_option' to='/home/settings/categories' onClick={handleClickOpt} >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Categorías
                    <SlArrowRight size={25} />
                </Link>
            </div>
        </div>
    );
}

export { Activities };