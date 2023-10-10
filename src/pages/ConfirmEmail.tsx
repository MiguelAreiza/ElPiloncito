import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { TitlePage } from '../components/TitlePage';
import { Button } from '../components/Button';
// Styles
import '../styles/Auth.css';

function ConfirmEmail() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();

    useEffect( () => {
        setMenuConfig({
            basic: true,
            path: '/auth/login'
        });
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {        
        e.preventDefault();
        
        try {
            const body = {
                'user_Id': params.id
            };
            const data = await postApiData('Auth/EmailConfirm', body, false, 'application/json');
            addToastr(data.rpta);
            navigate('/auth/login');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }

    return (
        <form className='auth_form' onSubmit={handleSubmit}>
            <TitlePage image='logo' title='COMIDAS RAPIDAS' color='var(--white)' />

            <h2 className='auth_title'>Confirmar Email</h2>
            <Button name='Confirmar' type='submit' />
        </form>
    );
}

export { ConfirmEmail };