import React from 'react';

// Components
// import { useAppStates } from '../helpers/states';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
// Styles
import '../styles/LandingPage.css';
// Sources
import Swal from 'sweetalert2';
import imgConfirmSave from '../assets/images/icons/ConfirmSave.svg'

function ContactForm() {    
    // const { setIsLoading, addToastr } = useAppStates();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [type, setType] = React.useState('');
    const [headquarter, setHeadquarter] = React.useState('');
    const [message, setMessage] = React.useState('');
    const typeOptions = [
        {'id': 'Pregunta', 'strName': 'Pregunta'},
        {'id': 'Queja', 'strName': 'Queja'},
        {'id': 'Reclamo', 'strName': 'Reclamo'},
        {'id': 'Sugerencia', 'strName': 'Sugerencia'}
    ]
    const headquarterOptions = [
        {'id': 'Belen', 'strName': 'Belen'},
        {'id': 'Santa Mónica', 'strName': 'Santa Mónica'}
    ]

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
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Email' type='email' value={email} setValue={setEmail} />
            <Input name='Tipo' type='select' value={type} setValue={setType} options={typeOptions} />
            <Input name='Sede' type='select' value={headquarter} setValue={setHeadquarter} options={headquarterOptions} />
            <Input name='Mensaje' type='textarea' value={message} setValue={setMessage} /> 
            <Button name='Contactar' type='submit' icon='next' />
        </form>
    );
}

export { ContactForm };