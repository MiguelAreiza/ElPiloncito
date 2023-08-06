import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
// Styles
import '../styles/Delivery.css';
// Sources
import axios from 'axios';
import imgLogo from '../assets/images/Logo.svg';

function Delivery() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path } = useAuth();
    const [headquarter, setHeadquarter] = React.useState('');
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [sector, setSector] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [paymentMathod, setPaymentMathod] = React.useState('');
    const optsHeadquarter = [
        {Id:'9B056EA8-04C3-4D5A-A66D-7AA28BFA9E28', Name:'Santa monica'},
        {Id:'A9BEF061-9B78-4BBE-BB03-B0FCD525AAD1', Name:'Belen las playas'}
    ];
    const [optsSector, setOptsSector] = React.useState([]);
    const optsPaymentMethod = [
        {Id:'Efectivo', Name:'Efectivo'},
        {Id:'Transferencia', Name:'Transferencia'}
    ];
    
    React.useEffect( () => {        
        setMenuConfig(() => ({
            basic: true,
            active: true,
            path: '/'
        }));
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeHeadquarter = ({value}) => {
        axios.get(`${path}api/Sector/GetSectorsByRestaurant?Restaurant_Id=${value}`)
        .then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                setOptsSector([]);
                return;
            }
            setOptsSector(data.sectors);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });
    }

    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='DOMICILIOS' />

            <div className="form_inputs">
                <Input name='Sede' type='select' value={headquarter} setValue={setHeadquarter} options={optsHeadquarter} onChange={handleChangeHeadquarter} />
                <Input name='Nombre' type='text' value={name} setValue={setName} />
                <Input name='Teléfono' type='tel' value={phone} setValue={setPhone} />
                <Input name='Dirección' type='geolocation' value={address} setValue={setAddress} />
                <Input name='Sector' type='select' value={sector} setValue={setSector} options={optsSector} />
                <Input name='Email' type='email' value={email} setValue={setEmail} required={false} /> 
                <Input name='Método de pago' type='select' value={paymentMathod} setValue={setPaymentMathod} options={optsPaymentMethod} defaultValue='Efectivo' />

                <Button name='Confirmar domicilio' type='submit' icon='next' />
            </div>
        </div>
    );
}

export { Delivery };