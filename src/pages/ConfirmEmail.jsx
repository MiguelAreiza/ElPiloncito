import React from 'react';
import { useParams } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
import '../styles/Auth.css';
// Sources
import axios from 'axios';
import imgLogo from '../assets/images/Logo.svg';

function ConfirmEmail() {
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const params = useParams();

    React.useEffect( () => {
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = e => {        
        e.preventDefault();
        setIsLoading(true);

        if (!navigator.onLine) {
            addToastr('Revisa tu conexion a internet', 'info');   
            setIsLoading(false);
            return;
        }

        axios.post(`${auth.path}api/Auth/EmailConfirm`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${params.token}`
            }
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            auth.login(data.appUser, data.token);
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });        
    }

    return (
        <>
            <Menu path='/auth/login' basic />
            <form className='auth_form' onSubmit={handleSubmit}>
                <Header logo={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Confirmar Email</h2>
                <Button name='Confirmar' type='submit' />
            </form>
        </>
    );
}

export { ConfirmEmail };