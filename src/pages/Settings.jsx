import React from 'react';
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
        setMenuConfig((prevConfig) => ({
            ...prevConfig,
            home: false,
            basic: false,
            active: true,
            option: 'settings'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='CONFIGURACIÓN' />
            
            <div className="container_config_options">
                <button className='config_option' type='button' name='Admin Categorías' >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Categorías
                    <SlArrowRight size={25} />
                </button>
                <button className='config_option' type='button' name='Admin Subcategorías' >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Subcategorías
                    <SlArrowRight size={25}  />
                </button>
                <button className='config_option' type='button' name='Admin Productos' >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Productos
                    <SlArrowRight size={25}  />
                </button>
                <button className='config_option' type='button' name='Admin Usuarios' >
                    <BiSolidCategoryAlt size={40} />
                    <br/>Usuarios
                    <SlArrowRight size={25}  />
                </button>
            </div>
        </div>
    );
}

export { Settings };