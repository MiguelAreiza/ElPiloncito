import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
// Styles
import '../styles/Header.css';
// Sources
import imgNavbar from '../assets/images/NavbarLogo.svg'; 
import imgMenu0 from '../assets/images/icons/Menu0.svg';
import imgMenu1 from '../assets/images/icons/Menu1.svg';

function Header({ landingPage, logo, title}) {

    const auth = useAuth();
    const { setIsLoading, addToastr } = useAppStates();
    const location = useLocation();
    const navigate = useNavigate();
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

    const handleClickInicio = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const handleClickCarta = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const handleClickSedes = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const handleClickNosotros = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const handleClickContacto = e => {
        const type = e.target.classList.contains('optNavbar')?'navbar':'menu';
        selectOpt(e, type);
        addToastr('Proximamente', 'info');
    }

    const handleClickDomicilios = e => {
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
        }
    }

    return (
        <>
            {
                !landingPage ? 
                    <div className='header'>                
                        <img className='header_logo' src={logo} alt={'logo' + title} draggable='false' width='70px' height='70px' />
                        <label className='header_name'>{auth.user ? auth.user.restaurants[0].strName : 'MaddiFood'}</label>
                        <label className='header_title'>{subtitle + title}</label>
                    </div>                    
                :
                    <header className='navbar'>
                        <div className='navbar_left'>
                            <img src={imgNavbar} alt='Logo el piloncito' draggable='false' width='230px' height='60px' />
                        </div>
                        <div className='navbar_center'>
                            <button className='optNavbar optNavbarSelected' onClick={handleClickInicio} >Inicio</button>
                            <button className='optNavbar' onClick={handleClickSedes} >Sedes</button>
                            <button className='optNavbar' onClick={handleClickNosotros} >Nosotros</button>
                            <button className='optNavbar' onClick={handleClickContacto} >Contacto</button>
                            <button className='optNavbar' onClick={handleClickCarta} >Carta</button>
                            <button className='optNavbar' onClick={handleClickDomicilios} >Domicilios</button>
                        </div>
                        <div className='navbar_rigth'>
                            <img src={imgMenu1} onClick={handleClickMenu} alt='Menu MaddiFood' draggable='false' />
                            <div className='navbar_menu'>
                                <button className='optMenu optMenuSelected' onClick={handleClickInicio} >Inicio</button>
                                <button className='optMenu' onClick={handleClickSedes} >Sedes</button>
                                <button className='optMenu' onClick={handleClickNosotros} >Nosotros</button>
                                <button className='optMenu' onClick={handleClickContacto} >Contacto</button>  
                                <button className='optMenu' onClick={handleClickCarta} >Carta</button>
                                <button className='optMenu' onClick={handleClickDomicilios} >Domicilios</button>   
                            </div>
                        </div>
                    </header>
            }
        </>
    );

}

export { Header };