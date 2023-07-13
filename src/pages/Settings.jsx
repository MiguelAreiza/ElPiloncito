import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
// import '../styles/Settings.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';

function Settings() {
    const { setIsLoading } = useAppStates();
    
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='page_container'>
            <Menu />
            <Header logo={imgLogo} title='COMIDAS RAPIDAS' />
            
            <Button name='Admin. Categorías' icon='next' />
            <Button name='Admin. Subcategorías' icon='next' dark />
            <Button name='Admin. Productos' icon='next' />
            <Button name='Admin. Usuarios' icon='next' dark />
        </div>
    );
}

export { Settings };