import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
// import { Input } from '../components/Input';
import { Button } from '../components/Button';
// Styles
import '../styles/LandingPage.css';
// Sources
import Swal from 'sweetalert2';
import imgConfirmSave from '../assets/images/icons/ConfirmSave.svg'

function ContactForm() {    
    const { setIsLoading, addToastr } = useAppStates();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [type, setType] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = e => {
        e.preventDefault(); 
        Swal.fire({
            html: `
                <img style='margin: 2vh 0;' src='${imgConfirmSave}' alt='icono guardar' />
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Deseas enviar la notificación al equipo de El Piloncito?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                alert('mensaje enviado correctamente');
            }
        });
    }

    return (
        <form className='contact_form' onSubmit={handleSubmit}>
            {/* <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Categoría activa' type='checkbox' value={biActive} setValue={setBiActive} />  */}

            <Button name='Contactar' type='submit' icon='next' />
        </form>
    );
}

export { ContactForm };