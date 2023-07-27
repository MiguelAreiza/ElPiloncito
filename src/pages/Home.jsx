import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
import '../styles/Home.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgDefaultUser from '../assets/images/DefaultUser.svg';

function Home() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const { user, path } = useAuth();
    const navigate = useNavigate();
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            home: true,
            option: 'home'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickAction = () => {
        setIsLoading(true);
        navigate('/home/settings');
    }

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='COMIDAS RAPIDAS' />
            <h2 className='welcome_user'>Bienvenid{user.gender = 'hombre'?'o':'a'} <br /> {user.name}</h2>
            <div className="user_image">
                <img src={path+'AssetsImage/'+user.imageUrl||imgDefaultUser} alt="Imagen del usuario el piloncito" />
            </div>
            <Button name='Configuración app' icon='next' dark onClick={handleClickAction}/>
        </div>
    );
}

export { Home };