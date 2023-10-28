import { useCallback, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill, BsFillBookmarkCheckFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { useAuth } from '../helpers/auth';
import { transformToOptions } from '../helpers/functions';
import { TitlePage } from '../components/TitlePage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
// Styles
import '../styles/TakeOrder.css'
// Sources
import Swal from 'sweetalert2'; 

interface Table {
    Id: string
    Name: string
    Capacity: number
    Available: boolean
}

interface GetTablesData {
    tables: Array<Table>;
    cod: string;
}

interface Product {
    Id: string
    Subcategory: string
    ImageUrl: string
    Name: string
    Price: number
    Description: string
    Active: boolean
    Outstanding: boolean
}

interface GetProductsData {
    products: Array<Product>;
    cod: string;
}

interface ProductByOrder {
    Id: string
    ProductFk: string
    StrName: string
    IntQuantity: number
    DeTotal: number
    StrRemarks: string
}

function TakeOrder() {    
    const { addToastr, setMenuConfig, newId } = useAppStates();
    const { user } = useAuth();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [table, setTable] = useState<any>([]);
    const [client, setClient] = useState('');
    const [product, setProduct] = useState<any>([]);
    const [quantity, setQuantity] = useState(1);
    const [remarks, setRemarks] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<any>([]);
    const [remarksInvoice, setRemarksInvoice] = useState('');
    const [totalInvoice, setTotalInvoice] = useState<string | number>(0);
    const [packed, setPacked] = useState(false);
    const [prepaid, setPrepaid] = useState(true);
    const [optsTable, setOptsTable] = useState<Array<Table>>([]);
    const [optsProduct, setOptsProduct] = useState<Array<Product>>([]);
    const [productsByOrder, setProductByOrder] = useState<Array<ProductByOrder>>([]);
    const optsPaymentMethod = [
        {Id:'Efectivo', Name:'Efectivo'},
        {Id:'Transferencia', Name:'Transferencia'}
    ];

    const getTables = useCallback(async () => {
        if (optsTable.length !== 0) {
            return;
        }
        try {
            const data: GetTablesData = await getApiData('Table/GetTablesByUser', true);
            if (!data.tables.length) {
                addToastr('Registra tu primera mesa', 'info');
            }
            setOptsTable(data.tables);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsTable, addToastr, getApiData]);
    
    const getProducts = useCallback(async () => {
        if (optsProduct.length !== 0) {
            return;
        }
        try {
            const data: GetProductsData = await getApiData('Product/GetproductsByUser', true);
            if (!data.products.length) {
                addToastr('Registra tu primer producto', 'info');
            }
            setOptsProduct(data.products);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsProduct, addToastr, getApiData]);

    useEffect(() => {
        getTables();
        getProducts();

        const returnPath = user?.roleId.toUpperCase() === 'C55193E9-7DB1-424B-B432-CA76899D99B4' ? '/home/actions' : '/home';
        setMenuConfig(() => ({
            path: returnPath,
            option: 'actions'
        }));

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

    const handleClickDelete = (id: string) => {
        const newProducts = productsByOrder.filter(product => product.Id !== id);
        setProductByOrder(newProducts);

        const total = newProducts.reduce((acc, product) => {
            return acc + product.DeTotal;
        }, 0);        
        setTotalInvoice(total);
    }

    const transformProductsByOrder = (data: Array<ProductByOrder>) => {
		return data.map( option => {
			return {
				ProductFk: option.ProductFk,
				IntQuantity: option.IntQuantity,
				StrRemarks: option.StrRemarks
			};
		});
	};

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Crear</b> un nuevo pedido?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            if (!productsByOrder) {
                addToastr('Debes ingresar por lo menos un producto', 'warning');
                return
            }
            try {
                const body = {
                    'client': client,
                    'table_Id': table.value, 
                    'paymentMethod': paymentMethod.value,
                    'prepaid': prepaid,
                    'packed': packed,
                    'remarks': remarksInvoice,
                    'productsByInvoice': transformProductsByOrder(productsByOrder)
                };
                const data: ResponseApi = await postApiData('Invoice/CreateOrderInvoice', body, true, 'application/json');
                addToastr(data.rpta);

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
                    if (user?.roleId.toUpperCase() === 'C55193E9-7DB1-424B-B432-CA76899D99B4')
                        navigate('/home/actions');
                    else
                        navigate('/home');
                });
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [productsByOrder, client, table, paymentMethod, prepaid, packed, remarksInvoice, user, addToastr, navigate, postApiData, totalInvoice]);
    
    return (
        <div className='page_container'>
            <TitlePage image='logo' title='TOMAR PEDIDO' />
            
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input type='select' value={table} setValue={setTable} name='Mesa' options={transformToOptions(optsTable)} defaultValue={table} /> 
                <Input type='text' value={client} setValue={setClient} name='Cliente' required={false} />

                <div className='order_description'>
                    <Input type='select' value={product} setValue={setProduct} name='Producto' options={transformToOptions(optsProduct)} defaultValue={product} required={false} /> 
                    <Input type='number' value={quantity} setValue={setQuantity} name='Cantidad' required={false} min={1} />
                    <Input type='textarea' value={remarks} setValue={setRemarks} name='Comentarios' required={false} />

                    <Button name='Agregar al pedido' type='button' icon='add' onClick={handleClickAdd} />

                    <div className='order_products_container'>
                        <h3><FaShoppingCart size={25} color='var(--principal)' />Tu carrito</h3>
                        <div className='card_container'>
                            { productsByOrder[0] ?
                                productsByOrder.map(({Id, StrName, IntQuantity, DeTotal, StrRemarks}) => {
                                    return( 
                                        <Card 
                                            key={Id} 
                                            onDelete={() => handleClickDelete(Id)}
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

                <Input type='select' value={paymentMethod} setValue={setPaymentMethod} name='Método de pago' options={transformToOptions(optsPaymentMethod)} defaultValue='Efectivo' /> 
                <Input type='money' value={totalInvoice} setValue={setTotalInvoice} name='Total a pagar' disabled />
                <Input type='checkbox' value={packed} setValue={setPacked} name='Para llevar' />
                <Input type='checkbox' value={prepaid} setValue={setPrepaid} name='Pago inmediato' />
                <Input type='textarea' value={remarksInvoice} setValue={setRemarksInvoice} name='Comentarios del pedido' required={false} />

                <Button name='Confirmar pedido' type='submit' icon='next' />
            </form>
        </div>
    );
}

export { TakeOrder };