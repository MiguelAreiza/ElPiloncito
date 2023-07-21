import React from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { Input } from '../components/Input';
import { Button } from '../components/Button';
// Styles
import '../styles/LandingPage.css';
// Sources
import Swal from 'sweetalert2';

function ContactForm() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [type, setType] = React.useState('');
    const [headquarter, setHeadquarter] = React.useState('');
    const [message, setMessage] = React.useState('');
    const typeOptions = [
        {'Id': 'Pregunta', 'Name': 'Pregunta'},
        {'Id': 'Queja', 'Name': 'Queja'},
        {'Id': 'Reclamo', 'Name': 'Reclamo'},
        {'Id': 'Sugerencia', 'Name': 'Sugerencia'}
    ]
    const headquarterOptions = [
        {'Id': 'Belen', 'Name': 'Belen'},
        {'Id': 'Santa Mónica', 'Name': 'Santa Mónica'}
    ]

    const handleSubmit = e => {
        e.preventDefault(); 
        Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Deseas enviar la notificación al equipo de El Piloncito?</div>`,
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