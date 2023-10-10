import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { TitlePage } from '../components/TitlePage';
import { Button } from '../components/Button';
// Styles
import '../styles/Home.css';
// Sources
import imgDefaultUser from '../assets/images/DefaultUser.svg';

function Home() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const { user, path } = useAuth();
    const navigate = useNavigate();
    const [urlTo, setUrlTo] = useState('');
    const [buttonName, setButtonName] = useState('');
    const imgPath = user?.imageUrl ? `${path}AssetsImage/${user.imageUrl}` : imgDefaultUser;
    const welcomeMessage = `Bienvenid${user?.gender === 'Hombre' ? 'o' : 'a'}`;

    useEffect(() => {
        setMenuConfig({
            home: true,
            option: 'home'
        });

        switch (user?.roleId.toUpperCase()) {
            case 'C55193E9-7DB1-424B-B432-CA76899D99B4':
                setUrlTo('/home/settings');
                setButtonName('Configuración app');
                break;
            case 'D1141F51-D57B-4376-915D-9D45DC29078C':
                setUrlTo('/home/actions/takeOrder');
                setButtonName('Tomar un pedido');
                break;
            case '5393DE55-0EB2-4DC7-813A-AFBEB8B995AD':
                setUrlTo('/home/actions/pendingOrders');
                setButtonName('Ver pedidos');
                break;
            default:
                setUrlTo('/home');
                setButtonName('Home');
                break;
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.roleId]);

    const handleClickAction = () => {
        setIsLoading(true);
        navigate(urlTo);
    };

    return (
        <div className='page_container'>
            <TitlePage image='logo' title='COMIDAS RAPIDAS' />

            <h2 className='welcome_user'>{welcomeMessage}<br/>{user?.name}</h2>
            <div className='user_image'>
                <img src={imgPath} alt='Imagen del usuario el piloncito' />
            </div>
            
            <Button name={buttonName} type='button' icon='next' onClick={handleClickAction} template='dark' />
        </div>
    );
}

export { Home };