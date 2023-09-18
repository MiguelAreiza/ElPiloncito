import React from 'react';

// Styles
import '../styles/Spinner.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';

function Spinner() {
    return (
        <div className='spinner_wrap'>
            <div className='spinner_circle'></div>
            <img className='spinner_image' src={imgLogo} alt='Logotipo de El Piloncito' draggable='false' width='120px' height='120px' />
        </div>
    );
}

export { Spinner };