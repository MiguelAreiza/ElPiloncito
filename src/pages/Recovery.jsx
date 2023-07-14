import React from 'react';
import { Navigate } from 'react-router-dom';

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

function Recovery() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, login, user } = useAuth();
    const [userName, setUserName] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [userId, setUserId] = React.useState('');

    React.useEffect(() => {
        setMenuConfig((prevConfig) => ({
            ...prevConfig,
            home: false,
            basic: true,
            active: true,
            path: '/auth/login'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeInput = (e, type) => {
        switch (type) {
            case 'user':
                setUserName(e.target.value);
                break;
            case 'otp':
                setOtp(e.target.value);
                break;
            case 'pass1':
                setPassword1(e.target.value);
                break;
            case 'pass2':
                setPassword2(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmitUser = e => {        
        e.preventDefault();        
        setIsLoading(true);

        axios.post(`${path}api/Auth/GetOTP`, {
            userName: userName
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
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block';
            
            addToastr(data.rpta);
            setIsLoading(false);            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
    }

    const handleSubmitOTP = e => {        
        e.preventDefault();        
        setIsLoading(true);

        if (otp.length !== 6) {            
            addToastr('El codigo debe ser de 6 digitos', 'info');
            setIsLoading(false);
            return;
        }

        axios.post(`${path}api/Auth/ValidateOTP`, {
            userName: userName,
            codeOTP: otp
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
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block'
            
            setUserId(data.id);
            addToastr('Validacion exitosa');
            setIsLoading(false);            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
    }

    const handleSubmitPass = e => {        
        e.preventDefault();        
        setIsLoading(true);
        
        if (password1 !== password2) {            
            addToastr('Las contraseñas deben coincidir', 'info');
            setIsLoading(false);
            return;
        }

        axios.post(`${path}api/Auth/ChangePasswordByOTP`, {
            user_Id: userId,
            password: password1,
            codeOTP: otp
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
            
            addToastr(data.rpta);
            login(data.appUser, data.token);            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
    }
    
    if (user) {
        return <Navigate to='/home' />
    }

    return (
        <>
            <form className='auth_form form_user' onSubmit={handleSubmitUser}>
                <Header logo={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Restablecer</h2>
                <input 
                    className='auth_input user' 
                    onChange={e =>{ handleChangeInput(e, 'user'); }} 
                    value={user} 
                    type='text' 
                    placeholder='Ingresa usuario' 
                    required
                />
                <Button name='Enviar código' type='submit' />
            </form>

            <form className='auth_form form_code' onSubmit={handleSubmitOTP}>
                <Header logo={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Restablecer</h2>
                <input 
                    className='auth_input code' 
                    onChange={e =>{ handleChangeInput(e, 'otp'); }} 
                    value={otp} 
                    type='number' 
                    placeholder='Ingresa código' 
                    required
                />
                <Button name='Validar código' type='submit' />
            </form>

            <form className='auth_form form_pass' onSubmit={handleSubmitPass}>
                <Header logo={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Restablecer</h2>                
                <input 
                    className='auth_input password' 
                    onChange={e =>{ handleChangeInput(e, 'pass1'); }} 
                    value={password1} 
                    type='password' 
                    placeholder='Ingresa contraseña' 
                    required 
                />
                <input 
                    className='auth_input password' 
                    onChange={e =>{ handleChangeInput(e, 'pass2'); }} 
                    value={password2} 
                    type='password' 
                    placeholder='Confirmar contraseña' 
                    required 
                />
                <Button name='Cambiar contraseña' type='submit' />
            </form>
        </>        
    );
}

export { Recovery };