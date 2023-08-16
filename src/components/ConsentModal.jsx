import React from 'react';
import { useLocation } from 'react-router-dom';

// Styles
import '../styles/ConsentModal.css'
// Sources
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import imgCookie from '../assets/images/icons/Cookie.svg'
import imgNotification from '../assets/images/icons/Notifications.svg'
import imgGeolocation from '../assets/images/icons/Geolocation.svg'

function ConsentModal({ consent, setConsent, type, addToastr }) {
    const [showModal, setShowModal] = React.useState(false);
    const location = useLocation();
    const configModal = type === 'cookies' ? {
        image: imgCookie,
        alt: 'Imagen de cookies',
        title: 'Política de Cookies',
        body: 'Este sitio web utiliza cookies para mejorar su experiencia. Acepta para continuar con acceso a todas las funciones.'
    }
    : type === 'notifications' ? {
        image: imgNotification,
        alt: 'Imagen de notificaciones',
        title: '¡No te pierdas nuestras novedades!',
        body: 'Recibe notificaciones sobre nuevas publicaciones y ofertas especiales.'
    }
    : type === 'geolocation' ? {
        image: imgGeolocation,
        alt: 'Imagen de geolocalización',
        title: '¿Nos permites acceder a tu ubicación?',
        body: 'Para brindarte una experiencia personalizada, necesitamos acceder a tu ubicación.'
    }
    : { }
    
    React.useEffect(() => {
        if (type === 'cookies' && location.pathname === '/auth/login') {
            setShowModal(true);
        } else if (type === 'notifications') {
            setTimeout(() => {
                setShowModal(true);                
            }, 80000);
        }    
    }, [type, location.pathname]);

    React.useEffect(() => {
        if (showModal && !consent)
            document.body.style.overflow = 'hidden';
        else
            document.body.style.overflow = 'auto';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    const allowCookies = () => {
        setConsent(true);
        localStorage.setItem('Allow-Cookies', true);
    }

    const allowNotifications = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setConsent(true);
                localStorage.setItem('Allow-Notifications', true);

                signInAnonymously(getAuth()).then(usuario => console.log(usuario));
                const token = await getToken(messaging, {
                    vapidKey: 'BOPZ5Ksdkg5ZnKtj5UZUGVLq7zw_kbcXhi3Y3-hzxVBBsfqSawcnvYpx6Zc1wbel6P0AknlH2rkSYia2lYEatGM'
                }).catch(error => {
                    console.log('Error al obtener el token: ', error)
                });
            
                if (token) {
                    onMessage(messaging, message => {
                        addToastr(message.notification.body);
                    });
                }
            }
        }
    };

    const handleAllowConsent = () => {
        setShowModal(false);
        if (type === 'cookies') {
            allowCookies();
        } else if (type === 'notifications') {
            allowNotifications();
        } else if (type === 'geolocation') {

        }
    };
  
    const handleDenyConsent = () => {
        setConsent(false);
        setShowModal(false);
        localStorage.setItem('Allow-Cookies', false);
    }

    return showModal && !consent ? (
        <div className='consent_modal'>
            <div className='consent_modal_body'>
                <div className='modal_content'>
                    <img src={configModal.image} alt={configModal.alt} />
                    <h3>{configModal.title}</h3>
                    <p>{configModal.body}</p>
                </div>
                <div className='modal_actions'>
                    <button onClick={handleAllowConsent}>Aceptar</button>
                    <button onClick={handleDenyConsent}>Rechazar</button>
                </div>
            </div>
        </div>
    ) : null;
}

export { ConsentModal }