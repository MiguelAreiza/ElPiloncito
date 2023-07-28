import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
// Sources
import axios from 'axios';
import Swal from 'sweetalert2';
import imgOrders from '../assets/images/Logo.svg';

function PendingOrders() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();
    const [pendingOrders, setPendingOrders] = React.useState([]);
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/actions',
            option: 'actions'
        }));

        axios.get(`${path}api/Invoice/GetInvoicesByUser`, {
            headers: {
                'Authorization': `bearer ${token}`,
            },
            withCredentials: true
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            if (!data.invoices.length) {
                addToastr('No existen facturas pendientes', 'info');
            }                            
            setPendingOrders(data.invoices);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);
    

    return (
        <div className='page_container'>
            <Header logo={imgOrders} title='Pedidos pendientes' />
            <div className='card_container'>
                {
                    pendingOrders.map( ({Id, Name}) => {
                        return(
                            <Card
                                key={Id}
                                // onEdit={() => {handleClickEdit(Id)}}
                                // onDelete={() => {handleClickDelete(Id)} }
                                name={Name}
                                isInvoice
                            />
                        )
                    })
                }
            </div>
        </div>
    );

}

export { PendingOrders };