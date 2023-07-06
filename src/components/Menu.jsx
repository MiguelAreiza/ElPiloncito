import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from "../helpers/states";
import { useAuth } from '../helpers/auth';
// Styles
import '../styles/Menu.css';

function Menu({ home, path}) {    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener("beforeinstallprompt", (event) => {
            // Prevent the mini-infobar from appearing on mobile.
            event.preventDefault();
            // Stash the event so it can be triggered later.
            window.deferredPrompt = event;
            // Remove the 'hidden' class from the install button container.
            setIsReadyForInstall(true);
        });
    }, []);
  
    async function handleClickDownloadApp() {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            // The deferred prompt isn't available.
            console.log("oops, no prompt event guardado en window");
            return;
        }
        // Show the install prompt.
        promptEvent.prompt();
        // Log the result
        await promptEvent.userChoice;
        // Reset the deferred prompt variable, since
        // prompt() can only be called once.
        window.deferredPrompt = null;
        // Hide the install button.
        setIsReadyForInstall(false);
    }

    const handleClickPerfil = () => {
        setIsLoading(true);
        navigate('/home/profile');
    }

    const handleClickSalir = () => {        
        setIsLoading(true);
        addToastr('¡Vuelve pronto!');
        auth.logout();
    }

    const handleClickAtras = () => {
        setIsLoading(true);
        navigate(path ? path : '/home');
    }

    return (           
        <div className='menu'>            
            {
                home ?                 
                    <>
                        <button onClick={handleClickSalir} type='button' className='menu_option menu_option_salir' aria-label='Salir' ></button>
                        <button onClick={handleClickPerfil} type='button' className='menu_option menu_option_perfil' aria-label='Ir a perfil' ></button>
                    </>
                : 
                    <>
                        <button onClick={handleClickAtras} type='button' className='menu_option menu_option_atras' aria-label='Ir atras' ></button>
                        {
                            isReadyForInstall && (<button onClick={handleClickDownloadApp} type='button' className='menu_option menu_option_download' aria-label='Descargar la app' ></button>)
                        }
                    </>

            }
        </div>
    );
}

export { Menu };
