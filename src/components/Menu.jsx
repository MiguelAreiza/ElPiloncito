import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiHome, BiTask, BiMoneyWithdraw, BiCategory, BiUser, BiLogOutCircle, BiRedo, BiCloudDownload } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
// Styles
import '../styles/Menu.css';
// Sources

function Menu({ config:{ path, home, basic, active = true, option='home' } }) {    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile.
            e.preventDefault();
            // Stash the event so it can be triggered later.
            window.deferredPrompt = e;
            // Remove the 'hidden' class from the install button container.
            setIsReadyForInstall(true);
        });
    }, []);
  
    async function handleClickDownloadApp() {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            // The deferred prompt isn't available.
            console.log('oops, no prompt event guardado en window');
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

    const handleClickLogOut = () => {        
        setIsLoading(true);
        addToastr('¡Vuelve pronto!');
        auth.logout();
    }

    const handleClickBack = () => {
        setIsLoading(true);
        navigate(path ? path : '/home');
    }

    const handleClickOpt = e => {
        if (!e.currentTarget.classList.contains('selected')) {
            setIsLoading(true);
            const menuOpts = document.querySelectorAll('.complete_option');
            menuOpts.forEach(element => {
                element.classList.remove('selected');
            });
            e.currentTarget.classList.add('selected');
        }
    }

    return active ? (
        <>
        {
            !basic ?
                <>
                    {
                        home ?
                            <div className="fast_menu">
                                <button onClick={handleClickLogOut} type='button' className='fast_option' aria-label='Salir' ><BiLogOutCircle size={30} /></button>
                            </div>
                        :
                            <div className="fast_menu">
                                <button onClick={handleClickBack} type='button' className='fast_option return' aria-label='Ir atras' ><BiRedo size={30} /></button>
                            </div>
                    }
                    <div className="complete_menu">
                        <Link className={`complete_option ${option === 'home' ? 'selected' : ''}`} onClick={handleClickOpt}  to='/home' >
                            <BiHome size={30} />
                        </Link>    
                        <Link className={`complete_option ${option === 'activities' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/activities' >
                            <BiTask size={30} />
                        </Link> 
                        <Link className={`complete_option ${option === 'accounting' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/accounting' >
                            <BiMoneyWithdraw size={30} />
                        </Link> 
                        <Link className={`complete_option ${option === 'settings' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/settings' >
                            <BiCategory size={30} />
                        </Link> 
                        <Link className={`complete_option ${option === 'profile' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/profile' >
                            <BiUser size={30} />
                        </Link>                
                    </div>
                </>
            :   
                <div className="fast_menu">
                    <button onClick={handleClickBack} type='button' className='fast_option return' aria-label='Ir atras' ><BiRedo size={30} /></button>
                    {
                        isReadyForInstall && (<button onClick={handleClickDownloadApp} type='button' className='fast_option download' aria-label='Descargar la app' ><BiCloudDownload size={30} /></button>)
                    }
                </div>
        }
        </>
    ) : null;
}

export { Menu };
