import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiRedo } from 'react-icons/bi';


// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Default.css';
// Sources
import image from '../assets/images/Page404.svg';

function Default() {
    const { setIsLoading } = useAppStates();
    const navigate = useNavigate();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickReturn = () => {
        setIsLoading(true);
        navigate(-1);
    }
    
    return (
        <>
            <img className='default_image' src={image} alt='Pagina no encontrada el piloncito' draggable='false' width='300px' height='300px' />
            <h3 className='default_title'>¿Te has perdido?</h3>
            <p className='default_description'>Pagina no disponible</p>
            <button className='default_button' onClick={handleClickReturn} ><BiRedo size={30} color='var(--black)' />Regresar</button>
        </>
    );
}

export { Default };