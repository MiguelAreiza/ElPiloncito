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
            <div className='socialnetworks_container'>
                <a href='https://www.facebook.com/p/El-Piloncito-Familiar-belencito-sede-principal-100057274638791/?locale=es_LA'>
                    <img src={imgFacebook} alt='Facebook de el piloincito' draggable='false' width='30px' height='30px' />
                </a>
                <a href='https://instagram.com/piloncito_belenlasplayas?igshid=MzRIODBiNWFIZA'>
                    <img src={imgInstagram} alt='Instagram de el piloincito' draggable='false' width='30px' height='30px' />
                </a>
                <a href='https://api.whatsapp.com/send?phone=573113175229&text=%C2%A1Vi%20su%20delicioso%20menu%20desde%20la%20carta%20digital!'>
                    <img src={imgWhatsApp} alt='WhatsApp de el piloincito' draggable='false' width='30px' height='30px' />
                </a>
            </div>
            <p className='copyrigth'>Copyright &copy; 2023 El Piloncito. Todos los derechos reservados.</p>
        </footer>
    );
}

export { Footer };