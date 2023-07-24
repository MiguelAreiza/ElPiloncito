import React from 'react';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { SlArrowRight } from 'react-icons/sl';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Settings.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';

function Settings() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            option: 'settings'
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
            <Header logo={imgLogo} title='CONFIGURACIÓN' />
            
            <div className="container_config_options">
                <Link className='config_option' to='/home/settings/categories' onClick={handleClickOpt} >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Categorías
                    <SlArrowRight size={25} />
                </Link>
                <Link className='config_option' to='/home/settings/subcategories' onClick={handleClickOpt} >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Subcategorías
                    <SlArrowRight size={25}  />
                </Link>
                <Link className='config_option' to='/home/settings/products' onClick={handleClickOpt} >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Productos
                    <SlArrowRight size={25}  />
                </Link>
                <Link className='config_option' to='/home/settings/tables' onClick={handleClickOpt} >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Mesas
                    <SlArrowRight size={25}  />
                </Link>
                <Link className='config_option' to='/home/settings/users' onClick={handleClickOpt} >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Usuarios
                    <SlArrowRight size={25}  />
                </Link>
            </div>
        </div>
    );
}

export { Settings };