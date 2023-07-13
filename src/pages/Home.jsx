import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
import '../styles/Home.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgDefaultUser from '../assets/images/DefaultUser.svg';

function Home() {
    const { setIsLoading } = useAppStates();
    const { user, path } = useAuth();
    
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='home_container'>
            <Menu home />
            <Header logo={imgLogo} title='COMIDAS RAPIDAS' />
            <h2 className='welcome_user'>Bienvenid{user.gender = 'hombre'?'o':'a'} <br /> {user.name}</h2>
            <div className="user_image">
                <img src={path+'AssetsImage/'+user.imageUrl||imgDefaultUser} alt="Imagen del usuario el piloncito" />
            </div>
            <Button name='Principal action' icon='next' dark />
        </div>
    );
}

export { Home };