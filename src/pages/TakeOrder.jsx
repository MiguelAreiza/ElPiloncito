import React from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill, BsFillBookmarkCheckFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
// Styles
import '../styles/TakeOrder.css'
// Sources
import axios from 'axios';
import Swal from 'sweetalert2'; 
import imgLogo from '../assets/images/Logo.svg';

function TakeOrder() {    
    const { setIsLoading, addToastr, setMenuConfig, newId } = useAppStates();
    const { path, token, user } = useAuth();
    const navigate = useNavigate();
    const [table, setTable] = React.useState('');
    const [client, setClient] = React.useState('');
    const [product, setProduct] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [remarks, setRemarks] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('');
    const [remarksInvoice, setRemarksInvoice] = React.useState('');
    const [totalInvoice, setTotalInvoice] = React.useState('0');
    const [prepaid, setPrepaid] = React.useState(true);
    const [packed, setPacked] = React.useState(false);
    const [optsTable, setOptsTable] = React.useState([]);
    const [optsProduct, setOptsProduct] = React.useState([]);
    const [productsByOrder, setProductByOrder] = React.useState([]);
    const optsPaymentMethod = [
        {Id:'Efectivo', Name:'Efectivo'},
        {Id:'Transferencia', Name:'Transferencia'}
    ];

    React.useEffect(() => {
        const returnPath = user.roleId.toUpperCase() === 'C55193E9-7DB1-424B-B432-CA76899D99B4' ? '/home/actions' : '/home';
        setMenuConfig(() => ({
            path: returnPath,
            option: 'actions'
        }));

        axios.get(`${path}api/Table/GetTablesByUser`, {
            headers: {
                'Authorization': `bearer ${token}`,
            }, 
            withCredentials : true
        }).then(({data})=> {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            if (!data.tables.length) {
                addToastr('Registra tu primera mesa', 'info');
            }

            setOptsTable(data.tables);

            axios.get(`${path}api/Product/GetproductsByUser`, {
                headers: {
                    'Authorization': `bearer ${token}`,
                }, 
                withCredentials : true
            }).then(({data})=> {
                if (data.cod === '-1') {
                    addToastr(data.rpta, 'warning');
                    setIsLoading(false);
                    return;
                }
                if (!data.products.length) {
                    addToastr('Registra tu primer producto', 'info');
                }
    
                setOptsProduct(data.products);
                setIsLoading(false);
            }).catch(error => {
                setIsLoading(false);
                addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
            });

        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

    const handleClickAdd = () => {
        if (!product) {
            addToastr('Debes seleccionar un producto', 'warning');
            return
        }
        if (!quantity || quantity < 1) {
            addToastr('Debes seleccionar una cantidad válida', 'warning'); 
            return
        }

        const data = product.complete;        
        const newProducts = [...productsByOrder, {Id:newId(), ProductFk:data.Id, StrName:data.Name, IntQuantity:quantity, DeTotal:data.Price * quantity, StrRemarks:remarks}];
        setProductByOrder(newProducts);

        setProduct('');
        setQuantity(1);
        setRemarks('');

        const total = newProducts.reduce((acc, product) => {
            return acc + product.DeTotal;
        }, 0);        
        setTotalInvoice(total);
        addToastr('Producto agregado exitosamente');
    }

    const handleClickDelete = (id) => {
        const newProducts = productsByOrder.filter( product => product.Id !== id);
        setProductByOrder(newProducts);

        const total = newProducts.reduce((acc, product) => {
            return acc + product.DeTotal;
        }, 0);        
        setTotalInvoice(total);
    }

    const transformProductsByOrder = data => {
		return data.map( option => {
			return {
				ProductFk: option.ProductFk,
				IntQuantity: option.IntQuantity,
				StrRemarks: option.StrRemarks
			};
		});
	};

    const handleSubmit = e => {
        e.preventDefault();
        Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Crear</b> un nuevo pedido?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                if (!productsByOrder) {
                    addToastr('Debes ingresar por lo menos un producto', 'warning');
                    return
                }
                setIsLoading(true);
                axios.post(`${path}api/Invoice/CreateOrderInvoice`, {
                    client: client,
                    table_Id: table.value, 
                    paymentMethod: paymentMethod.value,
                    prepaid: prepaid,
                    packed: packed,
                    remarks: remarksInvoice,
                    productsByInvoice: transformProductsByOrder(productsByOrder)
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${token}`
                    }, 
                    withCredentials : true
                }).then( ({data}) => {
                    if (data.cod === '-1') {
                        addToastr(data.rpta, 'warning');
                        setIsLoading(false);
                        return;
                    }
                    addToastr(data.rpta);
                    setIsLoading(false);
                    Swal.fire({
                        html: `${renderToString(<BsFillBookmarkCheckFill size={130} color='var(--green)' />)}
                               <div style='font-size: 1.5rem; font-weight: 700;'>Se ha creado correctamente el pedido de la mesa ${table.label}, para confirmarlo debes <b style='color:var(--green);'>Pagar</b> el valor de ${totalInvoice} en la caja.</div>`,
                        showCancelButton: false,
                        confirmButtonColor: 'var(--green)',
                        confirmButtonText: 'Continuar',
                        customClass: {
                            popup: 'swal2-background-custom'
                        }
                    }).then(() => {
                        if (user.roleId.toUpperCase() === 'C55193E9-7DB1-424B-B432-CA76899D99B4')
                            navigate('/home/actions');
                        else
                            navigate('/home');
                    });
                }).catch(error => {
                    setIsLoading(false);
                    addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
                });
            }
        });
    }
    
    return (
        <div className='page_container'>
            <Header logo={imgLogo} title='TOMAR PEDIDO' />
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input name='Mesa' type='select' value={table} setValue={setTable} options={optsTable} />
                <Input name='Cliente' type='text' value={client} setValue={setClient} required={false} />
                
                <div className='order_description'>
                    <Input name='Producto' type='select' value={product} setValue={setProduct} options={optsProduct} required={false} />
                    <Input name='Cantidad' type='number' min={1} value={quantity} setValue={setQuantity} required={false} />
                    <Input name='Comentarios' type='textarea' value={remarks} setValue={setRemarks} required={false} />

                    <Button name='Agregar al pedido' type='button' icon='add' onClick={handleClickAdd} />

                    <div className='order_products_container'>
                        <h3><FaShoppingCart size={25} color='var(--principal)' />Tu carrito</h3>
                        <div className='card_container'>
                            { productsByOrder[0] ?
                                productsByOrder.map( ({Id, StrName, IntQuantity, DeTotal, StrRemarks}) => {
                                    return( 
                                        <Card
                                            key={Id}
                                            canDelete
                                            onDelete={ () => handleClickDelete(Id)}
                                            name={StrName}
                                            quantity={IntQuantity}
                                            total={DeTotal}
                                            remarks={StrRemarks}
                                            isOrderProduct
                                        />
                                    )
                                })
                            :
                                <h4>Actualmente no tienes productos en el carrito.</h4>
                            }
                        </div>
                    </div>
                </div>

                <Input name='Método de pago' type='select' value={paymentMethod} setValue={setPaymentMethod} options={optsPaymentMethod} defaultValue='Efectivo' />
                <Input name='Total a pagar' type='money' value={totalInvoice} setValue={setTotalInvoice} disabled/>
                
                <Input name='Para llevar' type='checkbox' value={packed} setValue={setPacked} />
                <Input name='Pago inmediato' type='checkbox' value={prepaid} setValue={setPrepaid} />
                <Input name='Comentarios del pedido' type='textarea' value={remarksInvoice} setValue={setRemarksInvoice} required={false} />

                <Button name='Confirmar pedido' type='submit' icon='next' />
            </form>
        </div>
    );
}

export { TakeOrder };