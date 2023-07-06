import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { Menu } from '../components/Menu';
// Styles
import '../styles/PageContent.css';
// Sources
import image from '../assets/images/Page404.svg';

function Default() {
    const { setIsLoading } = useAppStates();
    
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            <Menu />
            <img className='default_image' src={image} alt='Pagina no encontrada el piloncito' draggable='false' width='300px' height='300px' />
        </>
    );
}

export { Default };