import React from 'react';

// Styles
import '../styles/Button.css'

function Button({ name, type = 'button', onClick, icon, secondIcon, disabled, dark, short }) {
    const templete = short && dark ? 'template_button short dark' : 
    dark ? 'template_button dark' : 
    short ? 'template_button short' : 
    'template_button';
    
    return (
        <div className='container_button'>
            <button
                className={templete + ' ' + icon + ' ' + secondIcon}
                type={type}
                name={name.replaceAll(' ','-')}
                disabled={disabled}
                onClick={onClick}
            >
                {name}
            </button>
        </div>
    );
}

export { Button };