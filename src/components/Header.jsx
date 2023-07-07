import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Header.css';
// Sources
import imgNavbar from '../assets/images/NavbarLogo.svg'; 
import imgMenu0 from '../assets/images/icons/Menu0.svg';
import imgMenu1 from '../assets/images/icons/Menu1.svg';

function Header({ landingPage, logo, title}) {

    const { setIsLoading, addToastr } = useAppStates();
    const navigate = useNavigate();
    const location = useLocation();
    const subtitle = location.pathname.includes('/new') ? 'Crear ' : location.pathname.includes('/edit') ? 'Editar ' : '' 
    
    const handleClickMenu = e => {
        let menu = e.target.nextElementSibling;
        let button = e.target;

        if (menu.style.display === 'none' || menu.style.display === '') {            
            button.style.transform = 'rotate(270deg)';
            menu.style.display = 'block';
            setTimeout(() => {
                button.src = imgMenu0;
            }, 400);
            setTimeout(() => {
                menu.style.height = 'calc(100vh - 90px)';
            }, 100);
        } else {
            button.style.transform = 'rotate(0deg)';
            menu.style.height = '0';
            setTimeout(() => {
                button.src = imgMenu1;
            }, 400);
            setTimeout(() => {
                menu.style.display = 'none';
            }, 1100);
        }
    }

    const handleClickBasicOpt = (e, name) => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        setTimeout(() => {
            window.scrollTo({
                top: document.querySelector(`.${name}_section`).offsetTop - 110,
                behavior: 'smooth'
            }); 
        }, type === 'menu' ? 1600 : 300 );
    }

    const handleClickDigitalMenu = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        window.open('https://piloncito.maddiapp.com');
    }

    const handleClickDeliveries = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const selectOpt = (opt, type) => {
        if (type === 'navbar') {
            const navbarOpts = document.querySelectorAll('.optNavbar');
            navbarOpts.forEach(element => {
                element.classList.remove('optNavbarSelected');
            });
            opt.target.classList.add('optNavbarSelected');
        } else {            
            const menuOpts = document.querySelectorAll('.optMenu');
            menuOpts.forEach(element => {
                element.classList.remove('optMenuSelected');
            });
            opt.target.classList.add('optMenuSelected');

            setTimeout(() => {
                let menu = opt.target.parentElement;
                let button = opt.target.parentElement.previousElementSibling;

                button.style.transform = 'rotate(0deg)';
                menu.style.height = '0';
                setTimeout(() => {
                    button.src = imgMenu1;
                }, 400);
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 1100);
            }, 300);
        }
    }

    const handleclickLogo = () => {
        setIsLoading(true);
        navigate('/auth/login');
    }

    return (
        <>
            {
                !landingPage ? 
                    <div className='header'>                
                        <img className='header_logo' src={logo} alt={'logo' + title} draggable='false' width='70px' height='70px' />
                        <label className='header_name'>El Piloncito</label>
                        <label className='header_title'>{subtitle + title}</label>
                    </div>                    
                :
                    <header className='navbar'>
                        <div className='navbar_left'>
                            <img onClick={handleclickLogo} src={imgNavbar} alt='Logo el piloncito' draggable='false' width='230px' height='60px' />
                        </div>
                        <div className='navbar_center'>
                            <button className='optNavbar optNavbarSelected' onClick={ e => handleClickBasicOpt(e, 'home')} >Inicio</button>
                            <button className='optNavbar' onClick={ e => handleClickBasicOpt(e, 'headquarters')} >Sedes</button>
                            <button className='optNavbar' onClick={ e => handleClickBasicOpt(e, 'us')} >Nosotros</button>
                            <button className='optNavbar' onClick={ e => handleClickBasicOpt(e, 'contact')} >Contacto</button>
                            <button className='optNavbar' onClick={handleClickDigitalMenu} >Carta</button>
                            <button className='optNavbar' onClick={handleClickDeliveries} >Domicilios</button>
                        </div>
                        <div className='navbar_rigth'>
                            <img src={imgMenu1} onClick={handleClickMenu} alt='Menu MaddiFood' draggable='false' />
                            <div className='navbar_menu'>
                                <button className='optMenu optMenuSelected' onClick={ e => handleClickBasicOpt(e, 'home')} >Inicio</button>
                                <button className='optMenu' onClick={ e => handleClickBasicOpt(e, 'headquarters')} >Sedes</button>
                                <button className='optMenu' onClick={ e => handleClickBasicOpt(e, 'us')} >Nosotros</button>
                                <button className='optMenu' onClick={ e => handleClickBasicOpt(e, 'contact')} >Contacto</button>  
                                <button className='optMenu' onClick={handleClickDigitalMenu} >Carta</button>
                                <button className='optMenu' onClick={handleClickDeliveries} >Domicilios</button>   
                            </div>
                        </div>
                    </header>
            }
        </>
    );

}

export { Header };