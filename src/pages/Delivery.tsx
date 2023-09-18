import { useEffect, useState } from 'react';
import { FaStore, FaShoppingCart, FaAddressCard, FaMoneyBill } from 'react-icons/fa';
import { MdOutlineDeliveryDining, MdStorefront } from 'react-icons/md';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';
import { Map } from '../components/Map';
// Styles
import '../styles/Delivery.css';
// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgMarker from '../assets/images/MarkerLogo.png';

interface Store {
    value: string
    label: string
    complete: {
        Id: string
        Name: string
        Address: { 
            lat: number 
            lng: number
        }
    }
}

function Delivery() {
    const { setIsLoading, addToastr, setMenuConfig, newId } = useAppStates();
    const { getApiData } = useApi();
    // Store
    const [isDelivery, setIsDelivery] = useState<boolean>(true);
    const [store, setStore] = useState<Store | null>(null);
    const optsStore: Array<SelectOption> = [
        {
            label: 'Santa monica',
            value: '9B056EA8-04C3-4D5A-A66D-7AA28BFA9E28',
            complete: {
                Id:'9B056EA8-04C3-4D5A-A66D-7AA28BFA9E28', 
                Name:'Santa monica', 
                Address: {lat:6.251402, lng:-75.608258}
            }
        },
        {
            label: 'Belen las playas',
            value: 'A9BEF061-9B78-4BBE-BB03-B0FCD525AAD1',
            complete: {
                Id:'A9BEF061-9B78-4BBE-BB03-B0FCD525AAD1', 
                Name:'Belen las playas', 
                Address: {lat:6.2227675, lng:-75.5941083}
            }
        }
    ];
    // ShoppingCart
    const [product, setProduct] = useState<SelectOption | null>();    
    const [quantity, setQuantity] = useState(1);
    const [remarks, setRemarks] = useState('');
    const [optsProduct, setOptsProduct] = useState([]);
    const [productsByOrder, setProductByOrder] = useState<Array<any>>([]);
    // Information
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [sector, setSector] = useState('');
    const [email, setEmail] = useState('');
    const [addressDetails, setAddressDetails] = useState('');
    const [remarksDelivery, setRemarksDelivery] = useState('');
    const [optsSector, setOptsSector] = useState([]);
    // Payment
    const [paymentMathod, setPaymentMathod] = useState('');
    const [subtotal, setSubtotal] = useState('');
    const [deliveryPrice, setDeliveryPrice] = useState('');
    const [totalInvoice, setTotalInvoice] = useState('');
    const optsPaymentMethod: Array<SelectOption> = [
        {
            label: 'Efectivo',
            value: 'Efectivo',
            complete: {
                Id:'Efectivo', 
                Name:'Efectivo'
            }
        },
        {
            label: 'Transferencia',
            value: 'Transferencia',
            complete: {
                Id:'Transferencia', 
                Name:'Transferencia'
            }
        }
    ];
    // progress step bar
    const [optBar, setOptBar] = useState({opt: 1, porc: 20});
    
    const progressOptions = [
        { step: 1, name: 'Tienda', icon: <FaStore size={25} /> },
        { step: 2, name: 'Pedido', icon: <FaShoppingCart size={25} /> },
        { step: 3, name: 'Info', icon: <FaAddressCard size={25} /> },
        { step: 4, name: 'Pago', icon: <FaMoneyBill size={25} /> },
    ];

    useEffect( () => {
        setMenuConfig({
            basic: true,
            active: true,
            path: '/'
        });
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateBar = (increment: number) => {
        const opt = optBar.opt + increment;
        const porc = opt === 1 ? 20 : opt === 2 ? 50 : opt === 3 ? 80 : 100;
        setOptBar({opt:opt, porc:porc});
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleUpdateBar(1);
    }

    const handleChangeStore = async ({value}: any) => {
        if (!value) {
            return;
        }
        try {
            const data = await getApiData(`Sector/GetSectorsByRestaurant?Restaurant_Id=${value}`, false);
            setOptsSector(data.sectors);
            setOptsProduct([]);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
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

        const data: any = product.complete;
        const newProducts = [...productsByOrder, {Id:newId(), ProductFk:data.Id, StrName:data.Name, IntQuantity:quantity, DeTotal:data.Price * quantity, StrRemarks:remarks}];
        setProductByOrder(newProducts);

        setProduct(null);
        setQuantity(1);
        setRemarks('');

        const total = newProducts.reduce((acc, product) => {
            return acc + product.DeTotal;
        }, 0);
        setTotalInvoice(total);
        addToastr('Producto agregado exitosamente');
    }

    const handleClickDelete = (id: string) => {
        const newProducts = productsByOrder.filter( product => product.Id !== id);
        setProductByOrder(newProducts);

        const total = newProducts.reduce((acc, product) => {
            return acc + product.DeTotal;
        }, 0);        
        setTotalInvoice(total);
    }
    
    return (
        <>
            <Header logo={imgLogo} title='DOMICILIOS' />

            <div className='step_bar_container'>
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
                        <div className='isDelivery_contaier'>
                            <button className={isDelivery?'active':''} onClick={() => setIsDelivery(true)} type='button'><MdOutlineDeliveryDining size={50} />Domicilio</button>
                            <button className={!isDelivery?'active':''} onClick={() => setIsDelivery(false)} type='button'><MdStorefront size={50} />Retiro en tienda</button>
                        </div>
                        <Input type='select' value={store} setValue={setStore} name={isDelivery ? 'Tienda de compra' : 'Tienda de retiro'} onChange={handleChangeStore} options={optsStore} defaultValue='9B056EA8-04C3-4D5A-A66D-7AA28BFA9E28' />
                        <Map 
                            center={store?.complete ? store.complete.Address : undefined}
                            zoom={17}
                            className='stores'
                            icon={imgMarker}
                            onlyView
                        />
                    </div>
                }

                { optBar.opt === 2 &&
                    <div className='form_inputs'>
                        <Input type='select' value={product} setValue={setProduct} name='Producto' options={optsProduct} required={false} />
                        <Input type='number' value={quantity} setValue={setQuantity} name='Cantidad' required={false} min={1} />
                        <Input type='textarea' value={remarks} setValue={setRemarks}  name='Incluye una nota' required={false} />

                        <Button name='Agregar al carrito' type='button' icon='add' onClick={handleClickAdd} />
                        <div className='order_products_container'>
                            <h3><FaShoppingCart size={25} color='var(--principal)' />Tu carrito</h3>
                            <div className='card_container'>
                                { productsByOrder[0] ?
                                    productsByOrder.map( ({Id, StrName, IntQuantity, DeTotal, StrRemarks}) => {
                                        return( 
                                            <Card
                                                key={Id}
                                                onDelete={ () => handleClickDelete(Id)}
                                                type='order'
                                                item={{
                                                    name: StrName, 
                                                    quantity: IntQuantity, 
                                                    total: DeTotal, 
                                                    remarks: StrRemarks
                                                }}
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
                        <Input type='text' value={name} setValue={setName}  name='Nombre' />
                        <Input type='tel' value={phone} setValue={setPhone}  name='Teléfono' />
                        <Input type='geolocation' value={address} setValue={setAddress}  name='Dirección' />
                        <Input type='text' value={addressDetails} setValue={setAddressDetails}  name='Complemento de dirección' /> 
                        <Input type='select' value={sector} setValue={setSector}  name='Sector' options={optsSector} />
                        <Input type='email' value={email} setValue={setEmail}  name='Email' required={false} />
                        <Input type='textarea' value={remarksDelivery} setValue={setRemarksDelivery}  name='Comentarios' required={false} />
                    </div>
                }

                { optBar.opt === 4 &&
                    <div className='form_inputs'>
                        <Input type='select' value={paymentMathod} setValue={setPaymentMathod}  name='Método de pago' options={optsPaymentMethod} defaultValue='Efectivo' />
                        <Input type='money' value={subtotal} setValue={setSubtotal}  name='Subtotal' disabled/>
                        <Input type='money' value={deliveryPrice} setValue={setDeliveryPrice}  name='Domicilio' disabled/>
                        <Input type='money' value={totalInvoice} setValue={setTotalInvoice}  name='Total a pagar' disabled/>
                    </div>
                }
                
                <div className='opts_step_bar_container'>
                    <Button name='Atras' type='button' onClick={() => handleUpdateBar(-1)} disabled={optBar.opt <= 1 ? true : false} template='short dark' />
                    <Button name='Siguiente' type='submit' disabled={optBar.opt >= 4 ? true : false} template='short' />
                </div>
            </form>

            <Footer />
        </>
    );
}

export { Delivery };