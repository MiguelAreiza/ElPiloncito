import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
import '../styles/Login.css';
// Sources
import axios from 'axios';
import imgLogo from '../assets/images/Logo.svg';

function Login() {
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const [user, setUser] = React.useState('');
    const [password, setPasword] = React.useState('');
    const navigate = useNavigate();

    React.useEffect( () => {
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
        axios.post(`${auth.path}api/Account/Login`,
        {
            User: user,
            Pass: password
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            auth.login(data.appUser);
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });        
    }

    const handleClickRecovery = () => {
        setIsLoading(true);
        navigate('recovery');
    }

    if (auth.user) {
        return <Navigate to='/home' />
    }

    return (
        <>
            <Menu path='/' />
            <form className='login_form' onSubmit={handleSubmit}>
                <Header logo={imgLogo} title='COMIDAS RAPIDAS'/>
                <label className='section_form_title'>Iniciar Sesión</label>
                <input 
                    onChange={handleChangeUser} 
                    value={user} 
                    className='section_form_input type_user' 
                    type='text' 
                    placeholder='Ingresa usuario' 
                    required
                />
                <input 
                    onChange={handleChangePasword} 
                    value={password} 
                    className='section_form_input type_password' 
                    type='password' 
                    placeholder='Ingresa contraseña' 
                    required 
                />
                <Button name='Ingresar' type='submit' />
                <label className='section_recovery_link'>¿Olvidaste la contraseña? <b onClick={handleClickRecovery}>Recuperar</b></label>
            </form>
        </>
    );

}

export { Login };