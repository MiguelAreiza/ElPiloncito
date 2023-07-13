import React from 'react';

// Styles
import '../styles/Spinner.css';
// Sources
import Vector from '../assets/images/Logo.svg';

function Spinner() {
    return (
        <div className='spinner'>
            <div>
            </div>
            <img src={Vector} alt='El piloncito vector' draggable='false' width='120' height='120' />
        </div>
    );
}

export { Spinner };