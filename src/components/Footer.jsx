import React from 'react';

// Components
// import { useAppStates } from '../helpers/states';
// import { useAuth } from '../helpers/auth';
// Styles
import '../styles/Footer.css';
// Sources
import imgFooter from '../assets/images/FooterLogo.svg'; 
import imgFacebook from '../assets/images/socialNetworks/Facebook.svg'; 
import imgInstagram from '../assets/images/socialNetworks/Instagram.svg'; 
import imgWhatsApp from '../assets/images/socialNetworks/WhatsApp.svg'; 

function Footer() {

    return (
        <footer>
            <img src={imgFooter} alt='Logo el piloncito' draggable='false' width='300px' height='207px' />
            <div className="socialnetworks_container">
                <a href="http://">
                    <img src={imgFacebook} alt="Facebook de el piloincito" draggable='false' width='' height='' />
                </a>
                <a href="https://instagram.com/piloncito_belenlasplayas?igshid=MzRIODBiNWFIZA">
                    <img src={imgInstagram} alt="Instagram de el piloincito" draggable='false' width='' height='' />
                </a>
                <a href="http://">
                    <img src={imgWhatsApp} alt="WhatsApp de el piloincito" draggable='false' width='' height='' />
                </a>
            </div>
            <label className='copyrigth'>Copyright ©El Piloncito. Todos los derechos reservados.</label>
        </footer>
    );

}

export { Footer };