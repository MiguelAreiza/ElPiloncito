import React from 'react';
import { Navigate, Link } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
import '../styles/Auth.css';
// Sources
import axios from 'axios';
import imgLogo from '../assets/images/Logo.svg';

function Login() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const auth = useAuth();
    const [user, setUser] = React.useState('');
    const [password, setPasword] = React.useState('');

    React.useEffect( () => {
        setMenuConfig(() => ({
            basic: true,
            active: true,
            path: '/'
        }));
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleChangeUser = e => {
        setUser(e.target.value);
    }

    const handleChangePasword = e => {
        setPasword(e.target.value);
    }

    const handleSubmit = e => {        
        e.preventDefault();        
        setIsLoading(true);

        if (!navigator.onLine) {
            addToastr('Revisa tu conexion a internet', 'info');   
            setIsLoading(false);
            return;
        }

        axios.post(`${auth.path}api/Auth/Login`, {
            UserName: user,
            Password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
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

    if (auth.user) {
        return <Navigate to='/home' />
    }

    return (
        <form className='auth_form' onSubmit={handleSubmit}>
            <Header logo={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
            <h2 className='auth_title'>Iniciar Sesión</h2>
            <input 
                className='auth_input user' 
                onChange={handleChangeUser} 
                value={user} 
                type='text' 
                placeholder='Ingresa usuario' 
                required
            />
            <input 
                className='auth_input password' 
                onChange={handleChangePasword} 
                value={password} 
                type='password' 
                placeholder='Ingresa contraseña' 
                required 
            />
            <Button name='Ingresar' type='submit' />
            <Link className='recovery_link' to='/auth/recovery' >¿Olvidaste tu contraseña?</Link>
        </form>
    );
}

export { Login };