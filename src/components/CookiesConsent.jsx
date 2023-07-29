import React from 'react';

// Styles
import '../styles/CookiesConsent.css'
// Sources
import imgCookie from '../assets/images/icons/Cookie.svg';

function CookiesConsent({ cookiesConsent, setCookiesConsent }) {
    const [showModal, setShowModal] = React.useState(true);

    React.useEffect(() => {
        if (showModal && !cookiesConsent)
            document.body.style.overflow = 'hidden';
        else
            document.body.style.overflow = 'auto';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);
    
    const handleAllowCookies = () => {
        setCookiesConsent(true);
        setShowModal(false);
        localStorage.setItem('Allow-Cookies', true);
    };
  
    const handleDenyCookies = () => {
        setCookiesConsent(false);
        setShowModal(false);
        localStorage.setItem('Allow-Cookies', false);
    }

    return showModal && !cookiesConsent ? (
        <div className='cookie_consent_modal'>
            <div className='modal_body'>
                <div className='cookie_consent_content'>
                    <img src={imgCookie} alt="Imagen de cookies" />
                    <h3>Política de Cookies</h3>
                    <p>Este sitio web utiliza cookies para mejorar su experiencia. Acepta para continuar con acceso a todas las funciones.</p>
                </div>
                <div className='cookie_consent_actions'>
                    <button onClick={handleAllowCookies}>Aceptar</button>
                    <button onClick={handleDenyCookies}>Rechazar</button>
                </div>
            </div>
        </div>
    ) : null;
}

export { CookiesConsent }