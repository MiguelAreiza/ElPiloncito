import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Header.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgMenu0 from '../assets/images/icons/Menu0.svg';
import imgMenu1 from '../assets/images/icons/Menu1.svg';

function Header() {
    const { setIsLoading } = useAppStates();
    const navigate = useNavigate();
    
    const handleClickMenu: React.MouseEventHandler<HTMLImageElement> = e => {
        let menu = e.currentTarget.nextElementSibling as HTMLElement;
        let button = e.currentTarget;

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

    const handleClickBasicOpt = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, name?: string) => {
        const type = (e.currentTarget as HTMLElement).classList.contains('opt_web_menu')?'web':'mobile';
        const continer = document.querySelector(`.${name}_section`) as HTMLDivElement;
        selectOpt(e.currentTarget, type);
        if (name) {
            setTimeout(() => {
                window.scrollTo({
                    top: continer.offsetTop - 110,
                    behavior: 'smooth'
                });
            }, type === 'mobile' ? 1600 : 300 );
        }
    }

    const selectOpt = (opt: HTMLElement, type: string) => {
        if (type === 'web') {
            const menuOpts = document.querySelectorAll('.opt_web_menu');
            menuOpts.forEach(element => {
                element.classList.remove('selected');
            });
            opt.classList.add('selected');
        } else if (type === 'mobile') {            
            const menuOpts = document.querySelectorAll('.opt_mobile_menu');
            menuOpts.forEach(element => {
                element.classList.remove('selected');
            });
            opt.classList.add('selected');

            setTimeout(() => {
                let menu = opt.parentElement!.parentElement as HTMLElement;
                let button = opt.parentElement!.parentElement!.previousElementSibling as HTMLImageElement;

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
        <header className='header_landingPage'>
            <div className='header_left'>
                <img onClick={handleclickLogo} src={imgLogo} alt='Logo el piloncito' draggable='false' width='50px' height='50px' />
                <div>
                    <h1>El Piloncito</h1>
                    <h2>COMIDAS RAPIDAS</h2>
                </div>
            </div>
            <nav className='header_center'>
                <ul className='web_menu'>
                    <li>
                        <Link className='opt_web_menu selected' to='/' onClick={e => handleClickBasicOpt(e, 'home')}>Inicio</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/' onClick={e => handleClickBasicOpt(e, 'headquarters')}>Sedes</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/' onClick={e => handleClickBasicOpt(e, 'us')}>Nosotros</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/' onClick={e => handleClickBasicOpt(e, 'contact')}>Contacto</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/store' onClick={() => setIsLoading(true)}>Carta</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/delivery' onClick={() => setIsLoading(true)}>Domicilios</Link>
                    </li>
                </ul>
            </nav>
            <nav className='header_rigth'>
                <img src={imgMenu1} onClick={handleClickMenu} alt='Menu MaddiFood' draggable='false' />
                <ul className='mobile_menu'>                                
                    <li>
                        <Link className='opt_mobile_menu selected' to='/' onClick={ e => handleClickBasicOpt(e, 'home')}>Inicio</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/' onClick={ e => handleClickBasicOpt(e, 'headquarters')}>Sedes</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/' onClick={ e => handleClickBasicOpt(e, 'us')}>Nosotros</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/' onClick={ e => handleClickBasicOpt(e, 'contact')}>Contacto</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/store' onClick={() => setIsLoading(true)}>Carta</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/delivery' onClick={() => setIsLoading(true)}>Domicilios</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export { Header };