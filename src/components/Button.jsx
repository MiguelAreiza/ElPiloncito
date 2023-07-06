import React from 'react';

// Styles
import '../styles/Button.css'

function Button({ name, type = 'button', onClick, icon, secondIcon, disabled, dark }) {
    const templete = dark?'dark template_button':'template_button';
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