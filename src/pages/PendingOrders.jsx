import React from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill, BsCalendarDateFill } from 'react-icons/bs';
import { GiCook } from 'react-icons/gi';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
// Sources
import axios from 'axios';
import Swal from 'sweetalert2';
import imgOrders from '../assets/images/Logo.svg';

function PendingOrders() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token, user } = useAuth();
    const [pendingOrders, setPendingOrders] = React.useState([]);
    const [refresh, setRefresh] = React.useState('');
    
    React.useEffect(() => {
        const returnPath = user.roleId.toUpperCase() === 'C55193E9-7DB1-424B-B432-CA76899D99B4' ? '/home/actions' : '/home';
        setMenuConfig(() => ({
            path: returnPath,
            option: 'actions'
        }));

        setPendingOrders([]);
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

    const valueToCurrency = (value) => {
		const cleanValue = value.toString().replace(/[^0-9]/g, '');
		const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
		return formattedValue;
	};
    
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
                            <h4 style='margin: 0;font-size: .8rem;display: flex;justify-content: space-between;'>${detail.Name}:<b>X${detail.Quantity}</b></h4>
                            <p style='margin: 2px 0 0;'>${detail.Remarks}</p>
                            <hr>
                        </div>`;
                    });
                    const newWindow = window.open('print', 'Envio a cocina', 'width=500,height=500'); 
                    newWindow.document.write(`
                    <head>
                        <title>Envio a cocina</title>
                    </head>
                    <body style='margin: 0;padding: 0;'>
                        <div style='width: 48mm;display: flex;flex-direction: column;'>
                            <h1 style='font-size: 1.3rem;margin: 0 auto;'>Orden: # ${invoice.Type[0]}-${invoice.Serial}</h1>
                            ${renderToString(<GiCook size={40} color='#000' style={{margin:'auto'}}/>)}
                            <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Mesa:</b>${invoice.Table}</p>
                            <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Hora:</b>${new Date(invoice.Created).toLocaleString('en-US').replace(/:\d{2}(?=\s[A|P]M$)/, '').split(', ')[1]}</p>
                            <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Atendió:</b>${invoice.Waiter}</p>
                            <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Cliente:</b>${invoice.Client}</p>
                            <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Para llevar:</b>${invoice.Packed ? 'Si' : 'No'}</p>
                            <h2 style='font-size: 1.2rem;margin: 5px auto;'>Detalles</h2>
                            ${details}
                            <h4 style='margin: 2px 0 0;font-size: .8rem;display: flex;justify-content: space-between;'>Total:<b>${valueToCurrency(invoice.Total)}</b></h4>
                            <p style='margin: 5px 0;'>${invoice.Remarks}</p>
                        </div>
                    </body>`);
                    setTimeout(() => {
                        newWindow.document.close();
                        newWindow.focus();
                        newWindow.print();
                        newWindow.close();            
                    }, 500);
                }).catch(error => {
                    setIsLoading(false);
                    addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                });               
            }   
        });
    }

    const handleClickTotalSales = () => {
        
        Swal.fire({
            html: `${renderToString(<BsCalendarDateFill size={130} color='#0f0' />)}
                    <div style='font-size: 1.5rem; font-weight: 700;margin: 10px 0'>Para consultar el <b style='color:#0F0;'>Total</b> vendido, ingresa los datos de apertura y cierre?</div>
                    ${renderToString(
                    <div className='form_inputs' id='container_dates' style={{margin: '5px auto'}}>
                        <Input name='Fecha de inicio' type='datetime-local' />
                        <Input name='Fecha de fin' type='datetime-local' />
                    </div>
                    )}`,
            showCancelButton: false,
            confirmButtonColor: '#0F0',
            confirmButtonText: 'Consultar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then(({isConfirmed}) => {
            if (isConfirmed) {
                const dtStart = document.querySelector("#container_dates input[name='Fecha-de-inicio']").value;
                const dtEnd = document.querySelector("#container_dates input[name='Fecha-de-fin']").value;
                
                if (dtStart > dtEnd) {
                    addToastr('Debes ingresar datos validos', 'info');
                    return;
                }
                
                setIsLoading(true);
                axios.get(`${path}api/Invoice/GetTotalByDate?DtStart=${dtStart}&DtEnd=${dtEnd}`, {
                    headers: {
                        'Authorization': `bearer ${token}`,
                    },
                    withCredentials: true
                }).then(({data})=> {debugger
                    if (data.cod === '-1') {
                        addToastr(data.rpta, 'warning');
                        setIsLoading(false);
                        return;
                    }  
                    setIsLoading(false);
                    Swal.fire({
                        html: `${renderToString(<BsCalendarDateFill size={130} color='#0f0' />)}
                                <div style='font-size: 1.5rem; font-weight: 700;margin: 10px 0'>Para el rango consultado se vendio un valor de: <b style='color:#0F0;'>${valueToCurrency(data.rpta)}</b></div>`,
                        showCancelButton: false,
                        confirmButtonColor: '#0F0',
                        confirmButtonText: 'aceptar',
                        customClass: {
                            popup: 'swal2-background-custom'
                        }
                    })
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
            <button className='calculate_total_sales' onClick={handleClickTotalSales}>Ventas</button>
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