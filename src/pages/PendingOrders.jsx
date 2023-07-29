import React from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { GiCook } from 'react-icons/gi';

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
    const [pendingOrders, setPendingOrders] = React.useState([]);
    const [refresh, setRefresh] = React.useState('');
    
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
    }, [refresh]);
    
    const handleClickSendToKitchen = (invoice) => {
        Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Enviar</b> el pedido a cocina?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then(({isConfirmed}) => {
            if (isConfirmed) {
                setIsLoading(true);
                axios.post(`${path}api/Invoice/SendInvoiceToKitchen`, {
                    invoice_Id: invoice.Id
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${token}`
                    },
                    withCredentials: true
                }).then(({data})=> {
                    if (data.cod === '-1') {
                        addToastr(data.rpta, 'warning');
                        setIsLoading(false);
                        return;
                    }     
                    addToastr(data.rpta);
                    setRefresh(invoice.Id);
                    let details = ``;
                    JSON.parse(invoice.Details).forEach(detail => {
                        details += `
                        <div>
                            <h4 style="margin: 0;font-size: .8rem;display: flex;justify-content: space-between;">${detail.Name}:<b>X${detail.Quantity}</b></h4>
                            <p style="margin: 2px 0 0;">${detail.Remarks}</p>
                            <hr>
                        </div>`;
                    });

                    const newWindow = window.open('', '_blank'); 
                    newWindow.document.write(`
                    <body style="margin: 0;padding: 0;">
                        <div style="width: 48mm;display: flex;flex-direction: column;">
                            <h1 style="font-size: 1.3rem;margin: 0 auto;">Orden: # ${invoice.Type[0]}-${invoice.Serial}</h1>
                            ${renderToString(<GiCook size={40} color='#000' style={{margin:'auto'}}/>)}
                            <p style="margin: 0;font-size: .8rem;"><b style="margin-right: 10px;">Mesa:</b>${invoice.Table}</p>
                            <p style="margin: 0;font-size: .8rem;"><b style="margin-right: 10px;">Atendió:</b>${invoice.Waiter}</p>
                            <h2 style="font-size: 1.2rem;margin: 5px auto;">Detalles</h2>
                            ${details}
                        </div>
                    </body>`);
                    newWindow.document.close();
                    newWindow.print();
                    newWindow.onfocus = function() {
                        newWindow.close();
                    };
                }).catch(error => {
                    setIsLoading(false);
                    addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                });               
            }   
        });
    }

    return (
        <div className='page_container' style={{background:'#D9D9D9', width:'100%', minHeight:'100vh'}}>
            <Header logo={imgOrders} title='Pedidos pendientes' />
            <div className='card_container'>
                {
                    pendingOrders.map( invoice => {
                        return(
                            <Card
                                key={invoice.Id}
                                onEdit={() => {handleClickSendToKitchen(invoice)}}
                                isInvoice={invoice}
                            />
                        )
                    })
                }
            </div>
        </div>
    );

}

export { PendingOrders };