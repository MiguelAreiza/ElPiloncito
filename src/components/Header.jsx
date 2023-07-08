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
    const subtitle = location.pathname.includes('/new') ? 'Crear ' : location.pathname.includes('/edit') ? 'Editar ' :  ''
    
    const handleClickMenu = e => {
        let menu = e.target.nextElementSibling;
        let button = e.target;
        console.log(menu);

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
        const type = e.target.classList.contains('opt_web_menu')?'web':'mobile';
        selectOpt(e, type);
        setTimeout(() => {
            window.scrollTo({
                top: document.querySelector(`.${name}_section`).offsetTop - 110,
                behavior: 'smooth'
            }); 
        }, type === 'mobile' ? 1600 : 300 );
    }

    const handleClickDigitalMenu = e => {
        const type = e.target.classList.contains('opt_web_menu')?'web':'mobile';
        selectOpt(e, type);
        window.open('https://piloncito.maddiapp.com');
    }

    const handleClickDeliveries = e => {
        const type = e.target.classList.contains('opt_web_menu')?'web':'mobile';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const selectOpt = (opt, type) => {
        if (type === 'web') {
            const menuOpts = document.querySelectorAll('.opt_web_menu');
            menuOpts.forEach(element => {
                element.classList.remove('selected');
            });
            opt.target.classList.add('selected');
        } else if (type === 'mobile') {            
            const menuOpts = document.querySelectorAll('.opt_mobile_menu');
            menuOpts.forEach(element => {
                element.classList.remove('selected');
            });
            opt.target.classList.add('selected');

            setTimeout(() => {
                let menu = opt.target.parentElement.parentElement;
                let button = opt.target.parentElement.parentElement.previousElementSibling;

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
                        <img className='header_logo' src={logo} alt={'logo' + title} draggable='false' width='90px' height='90px' />
                        <h2 className='header_name'>El Piloncito</h2>
                        <h3 className='header_title'>{subtitle + title}</h3>
                    </div>                    
                :
                    <header>
                        <div className='header_left'>
                            <img onClick={handleclickLogo} src={imgNavbar} alt='Logo el piloncito' draggable='false' width='230px' height='60px' />
                        </div>
                        <nav className='header_center'>
                            <ul className='web_menu'>
                                <li>
                                    <a className='opt_web_menu selected' href='#/' onClick={ e => handleClickBasicOpt(e, 'home')}>Inicio</a>
                                </li>
                                <li>
                                    <a className='opt_web_menu' href='#/' onClick={ e => handleClickBasicOpt(e, 'headquarters')}>Sedes</a>
                                </li>
                                <li>
                                    <a className='opt_web_menu' href='#/' onClick={ e => handleClickBasicOpt(e, 'us')}>Nosotros</a>
                                </li>
                                <li>
                                    <a className='opt_web_menu' href='#/' onClick={ e => handleClickBasicOpt(e, 'contact')}>Contacto</a>
                                </li>
                                <li>
                                    <a className='opt_web_menu' href='#/' onClick={handleClickDigitalMenu}>Carta</a>
                                </li>
                                <li>
                                    <a className='opt_web_menu' href='#/' onClick={handleClickDeliveries}>Domicilios</a>
                                </li>
                            </ul>
                        </nav>
                        <nav className='header_rigth'>
                            <img src={imgMenu1} onClick={handleClickMenu} alt='Menu MaddiFood' draggable='false' />
                            <ul className='mobile_menu'>                                
                                <li>
                                    <a className='opt_mobile_menu selected' href='#/' onClick={ e => handleClickBasicOpt(e, 'home')}>Inicio</a>
                                </li>
                                <li>
                                    <a className='opt_mobile_menu' href='#/' onClick={ e => handleClickBasicOpt(e, 'headquarters')}>Sedes</a>
                                </li>
                                <li>
                                    <a className='opt_mobile_menu' href='#/' onClick={ e => handleClickBasicOpt(e, 'us')}>Nosotros</a>
                                </li>
                                <li>
                                    <a className='opt_mobile_menu' href='#/' onClick={ e => handleClickBasicOpt(e, 'contact')}>Contacto</a>
                                </li>
                                <li>
                                    <a className='opt_mobile_menu' href='#/' onClick={handleClickDigitalMenu}>Carta</a>
                                </li>
                                <li>
                                    <a className='opt_mobile_menu' href='#/' onClick={handleClickDeliveries}>Domicilios</a>
                                </li>
                            </ul>
                        </nav>
                    </header>
            }
        </>
    );

}

export { Header };