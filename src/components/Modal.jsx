import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';

// Components
// Styles
import '../styles/Modal.css';

function Modal({children, name, closeUrl, isOpen, setIsOpen}) {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = React.useState(false);
    const modalRef = React.useRef(null);

    React.useEffect(() => {
        setTimeout(() => {
            setActiveModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = React.useCallback(() => {
        setActiveModal(false);
        setTimeout(() => {
            setIsOpen(false);
            if (closeUrl) navigate(closeUrl);
        }, 700);
    }, [setIsOpen, closeUrl, navigate]);

    const handleClickWrapper = React.useCallback((e) => {
        if (e.target.nodeName !== 'DIV') return;

        if (modalRef.current && e.target.className.includes('modal_wrapper')) {
            modalRef.current.classList.add('animate');
            setTimeout(() => {
                modalRef.current.classList.remove('animate');
            }, 1000);
        }
    }, [])

    return isOpen ? ReactDOM.createPortal(
        <div className='modal_wrapper' onClick={handleClickWrapper}>
            <div className={`modal_container ${activeModal ? 'active' : ''}`} ref={modalRef}>
                <TiDelete className='modal_button' onClick={handleClose} />
                <h4 className='modal_header'>
                    {name}
                </h4>
                <div className='modal_body'>
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    ) : null;
}

export { Modal }