import React from 'react';

// Styles
import '../styles/Toastr.css';

function Toastr({ message, type, time }) {

    const [isActive, setIsActive] = React.useState(true);
    const timeoutRef = React.useRef(null);

    if (type !== 'info' && type !== 'warning' && type !== 'error') {
        type = 'toastr-success';
    } else {
        type = `toastr-${type}`;
    }

    const handleClick = () => {
        setIsActive(false);
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsActive(true);
    };

    const handleMouseLeave = () => {
        setIsActive(true);
        timeoutRef.current = setTimeout(() => {
            setIsActive(false);
        }, time ? time : 2000);
    };

    React.useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setIsActive(false);
        }, time ? time : 5000);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [time]);
    
    return isActive ? (
        <div
            className={'toastr ' + type}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span>{message}</span>
        </div>
    ) : null;
}

export { Toastr };