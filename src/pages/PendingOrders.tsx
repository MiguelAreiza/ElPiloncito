import { useCallback, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { GiCook } from 'react-icons/gi';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { valueToCurrency } from '../helpers/functions';
import { TitlePage } from '../components/TitlePage';
import { Card } from '../components/Card';
// Sources
import Swal from 'sweetalert2';
import { useApi } from '../helpers/api';

interface Order {
    Id: string
    Serial: number
    Table: string
    Waiter: string
    Client: string
    Total: string | number
    PaymentMethod: string
    Prepaid: boolean
    Created: string
    Remarks: string
    Type: string
    Packed: boolean
    Details: string
}

interface GetOrdersData {
    invoices: Array<Order>;
    cod: string;
}

interface Detail {
    Name: string
    Quantity: number
    Total: number
    Remarks: string
}

function PendingOrders() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { user } = useAuth();
    const { getApiData, postApiData } = useApi();
    const [pendingOrders, setPendingOrders] = useState<Array<Order>>([]);
    
    const getOrders = useCallback(async () => {
        setPendingOrders([]);
        try {
            const data: GetOrdersData = await getApiData('Invoice/GetInvoicesByUser', true);
            if (!data.invoices.length) {
                addToastr('No existen facturas pendientes', 'info');
            }
            setPendingOrders(data.invoices);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [addToastr, getApiData]);
    
    useEffect(() => {
        getOrders();

        const returnPath = user?.roleId.toUpperCase() === 'C55193E9-7DB1-424B-B432-CA76899D99B4' ? '/home/actions' : '/home';
        setMenuConfig(() => ({
            path: returnPath,
            option: 'actions'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

    const printOrder = (invoice: Order) => {
        let details = ``;
        JSON.parse(invoice.Details).forEach((detail: Detail) => {
            details += `
            <div>
                <h4 style='margin: 0;font-size: .8rem;display: flex;justify-content: space-between;'>${detail.Name}:<b>X${detail.Quantity}</b></h4>
                <p style='margin: 2px 0 0;'>${detail.Remarks}</p>
                <hr>
            </div>`;
        });
        const newWindow = window.open('print', 'Envio a cocina', 'width=500,height=500'); 
        newWindow?.document.write(`
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
            </body>`
        );
        setTimeout(() => {
            newWindow?.document.close();
            newWindow?.focus();
            newWindow?.print();
            newWindow?.close();            
        }, 500);
    }

    const handleClickSendToKitchen = async (invoice: Order) => {   
        
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Enviar</b> el pedido a cocina?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {            
            try {
                const body = {
                    'invoice_Id': invoice.Id
                };
                const data: ResponseApi = await postApiData('Invoice/SendInvoiceToKitchen', body, true, 'application/json');
                addToastr(data.rpta);
                getOrders();
                printOrder(invoice);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }            
        }   
    }

    return (
        <div className='page_container' style={{background:'#D9D9D9', width:'100%', minHeight:'100vh'}}>
            <TitlePage image='orders' title='Pedidos pendientes' />

            <div className='card_container'>
                {
                    pendingOrders.map( invoice => {
                        return(
                            <Card
                                key={invoice.Id}
                                onEdit={() => {handleClickSendToKitchen(invoice)}}
                                type='invoice'
                                item={invoice}
                            />
                        )
                    })
                }
            </div>
        </div>
    );

}

export { PendingOrders };