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
    const roleId = user.roleId.toUpperCase();
    const buttonName = roleId === 'D1141F51-D57B-4376-915D-9D45DC29078C' ? 'Tomar un pedido'
    : roleId === '5393DE55-0EB2-4DC7-813A-AFBEB8B995AD' ? 'Ver pedidos pendientes'
    : 'Configuración app';
    
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
        roleId === 'C55193E9-7DB1-424B-B432-CA76899D99B4' ?
            navigate('/home/settings')
        : roleId === 'D1141F51-D57B-4376-915D-9D45DC29078C' ?
            navigate('/home/actions/takeOrder')
        : roleId === '5393DE55-0EB2-4DC7-813A-AFBEB8B995AD' ?
            navigate('/home/actions/pendingOrders')
        :
            navigate('/home');
    }

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='COMIDAS RAPIDAS' />
            <h2 className='welcome_user'>Bienvenid{user.gender = 'hombre'?'o':'a'} <br /> {user.name}</h2>
            <div className="user_image">
                <img src={path+'AssetsImage/'+user.imageUrl||imgDefaultUser} alt="Imagen del usuario el piloncito" />
            </div>
            <Button name={buttonName} icon='next' dark onClick={handleClickAction}/>
        </div>
    );
}

export { Home };