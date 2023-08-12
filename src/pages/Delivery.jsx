import React from 'react';
import { FaStore, FaShoppingCart, FaAddressCard, FaMoneyBill } from 'react-icons/fa';
import { MdOutlineDeliveryDining, MdStorefront } from 'react-icons/md';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';
import { Map } from '../components/Map';
// Styles
import '../styles/Delivery.css';
// Sources
import axios from 'axios';
import imgLogo from '../assets/images/Logo.svg';
import imgMarker from '../assets/images/MarkerLogo.png';

function Delivery() {
    const { setIsLoading, addToastr, setMenuConfig, newId } = useAppStates();
    const { path } = useAuth();
    // Store
    const [isDelivery, setIsDelivery] = React.useState(true);
    const [store, setStore] = React.useState('');
    const optsStore = [
        {Id:'9B056EA8-04C3-4D5A-A66D-7AA28BFA9E28', Name:'Santa monica', address: {lat:6.251402, lng:-75.608258}},
        {Id:'A9BEF061-9B78-4BBE-BB03-B0FCD525AAD1', Name:'Belen las playas', address: {lat:6.2227675, lng:-75.5941083}}
    ];
    // ShoppingCart
    const [product, setProduct] = React.useState('');    
    const [quantity, setQuantity] = React.useState(1);
    const [remarks, setRemarks] = React.useState('');
    const [optsProduct, setOptsProduct] = React.useState([]);
    const [productsByOrder, setProductByOrder] = React.useState([]);
    // Information
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [sector, setSector] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [addressDetails, setAddressDetails] = React.useState('');
    const [remarksDelivery, setRemarksDelivery] = React.useState('');
    const [optsSector, setOptsSector] = React.useState([]);
    // Payment
    const [paymentMathod, setPaymentMathod] = React.useState('');
    const [subtotal, setSubtotal] = React.useState('');
    const [deliveryPrice, setDeliveryPrice] = React.useState('');
    const [totalInvoice, setTotalInvoice] = React.useState('');
    const optsPaymentMethod = [
        {Id:'Efectivo', Name:'Efectivo'},
        {Id:'Transferencia', Name:'Transferencia'}
    ];
    // progress step bar
    const [optBar, setOptBar] = React.useState({opt: 1, porc: 20});
    
    const progressOptions = [
        { step: 1, name: 'Tienda', icon: <FaStore size={25} /> },
        { step: 2, name: 'Pedido', icon: <FaShoppingCart size={25} /> },
        { step: 3, name: 'Info', icon: <FaAddressCard size={25} /> },
        { step: 4, name: 'Pago', icon: <FaMoneyBill size={25} /> },
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

    const handleClickUpdateBar = (increment) => {
        const opt = optBar.opt + increment;
        const porc = opt === 1 ? 20 : opt === 2 ? 50 : opt === 3 ? 80 : 100;
        setOptBar(prev => ({...prev, opt:opt, porc:porc}));
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleClickUpdateBar(1);
    }

    const handleChangeStore = ({value}) => {
        if (!value) 
            return;
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
            setOptsProduct([]);
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        });
    }

    const handleClickAdd = () => {
        if (!product) {
            addToastr('Debes seleccionar un producto', 'warning');
            return;
        }
        if (!quantity || quantity < 1) {
            addToastr('Debes seleccionar una cantidad válida', 'warning'); 
            return;
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

    // const transformProductsByOrder = data => {
	// 	return data.map( option => {
	// 		return {
	// 			ProductFk: option.ProductFk,
	// 			IntQuantity: option.IntQuantity,
	// 			StrRemarks: option.StrRemarks
	// 		};
	// 	});
	// };
    
    return (
        <>
            <Header logo={imgLogo} title='DOMICILIOS' />

            <div className="step_bar_container">
                <div className='step_bar'>
                    <div className='progress_bar' style={{ width: `${optBar.porc}%` }}></div>
                    {progressOptions.map(({ step, icon, name }) => (
                        <div
                            key={newId()}
                            className={`progress_option ${optBar.opt > step ? 'active' : optBar.opt === step ? 'current' : ''}`}
                        >
                            {optBar.opt === step && <div></div>}
                            {icon}
                            <span>{name}</span>
                        </div>
                    ))}
                </div>                
            </div>

            <form onSubmit={handleSubmit}>
                { optBar.opt === 1 &&
                    <div className='form_inputs'>
                        <div className="isDelivery_contaier">
                            <button className={isDelivery?'active':''} onClick={() => setIsDelivery(true)} type='button'><MdOutlineDeliveryDining size={50} />Domicilio</button>
                            <button className={!isDelivery?'active':''} onClick={() => setIsDelivery(false)} type='button'><MdStorefront size={50} />Retiro en tienda</button>
                        </div>
                        <Input name={isDelivery ? 'Tienda de compra' : 'Tienda de retiro'} type='select' value={store} setValue={setStore} options={optsStore} onChange={handleChangeStore} defaultValue='9B056EA8-04C3-4D5A-A66D-7AA28BFA9E28' />
                        <Map 
                            center={store.complete ? store.complete.address : null}
                            zoom={17}
                            className='map_for_stores'
                            icon={imgMarker}
                            onlyView
                        />
                    </div>
                }

                { optBar.opt === 2 &&
                    <div className='form_inputs'>
                        <Input name='Producto' type='select' value={product} setValue={setProduct} options={optsProduct} required={false} />
                        <Input name='Cantidad' type='number' min={1} value={quantity} setValue={setQuantity} required={false} />
                        <Input name='Incluye una nota' type='textarea' value={remarks} setValue={setRemarks} required={false} />

                        <Button name='Agregar al carrito' type='button' icon='add' onClick={handleClickAdd} />
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
                }

                { optBar.opt === 3 &&
                    <div className='form_inputs'>
                        <Input name='Nombre' type='text' value={name} setValue={setName} />
                        <Input name='Teléfono' type='tel' value={phone} setValue={setPhone} />
                        <Input name='Dirección' type='geolocation' value={address} setValue={setAddress} />
                        <Input name='Complemento de dirección' type='text' value={addressDetails} setValue={setAddressDetails} /> 
                        <Input name='Sector' type='select' value={sector} setValue={setSector} options={optsSector} />
                        <Input name='Email' type='email' value={email} setValue={setEmail} required={false} />
                        <Input name='Comentarios' type='textarea' value={remarksDelivery} setValue={setRemarksDelivery} required={false} />
                    </div>
                }

                { optBar.opt === 4 &&
                    <div className='form_inputs'>
                        <Input name='Método de pago' type='select' value={paymentMathod} setValue={setPaymentMathod} options={optsPaymentMethod} defaultValue='Efectivo' />
                        <Input name='Subtotal' type='money' value={subtotal} setValue={setSubtotal} disabled/>
                        <Input name='Domicilio' type='money' value={deliveryPrice} setValue={setDeliveryPrice} disabled/>
                        <Input name='Total a pagar' type='money' value={totalInvoice} setValue={setTotalInvoice} disabled/>
                    </div>
                }
                
                <div className='opts_step_bar_container'>
                    <Button name='Atras' type='button' onClick={() => handleClickUpdateBar(-1)} disabled={optBar.opt <= 1 ? true : false} short dark />
                    <Button name='Siguiente' type='submit' disabled={optBar.opt >= 4 ? true : false} short />
                </div>
            </form>

            <Footer />
        </>
    );
}

export { Delivery };