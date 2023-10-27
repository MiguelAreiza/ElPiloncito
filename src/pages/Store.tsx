import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbHandFinger, TbMenu2 } from 'react-icons/tb';
import { FaShoppingCart } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { BiRedo } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { CartProducts } from '../components/CartProducts';
// Styles
import '../styles/Store.css';
// sources
import imgLogo from '../assets/images/Logo.svg';

interface Category {
    Id: string
    Name: string
    Subcategories: Array<Subcategory>
}

interface Subcategory {
    Id: string
    Name: string
    Products: Array<Product>
}

interface Product {
    Id: string
    Name: string
    ImageUrl: string
    Price: string | number
    Description: string
    Outstanding: string
}

interface GetProductsData {
    products: string
    cod: string
}

function Store() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const navigate = useNavigate();
    const asideMenuRef = useRef<HTMLDivElement>(null);
    const { getApiData } = useApi();
    const [products, setProducts] = useState<Array<Category>>([]);
    const [filter, setFilter] = useState('');
    
    const getProducts = useCallback(async () => {
        if (products.length !== 0) {
            return;
        }
        try {
            const data: GetProductsData = await getApiData('Product/GetProductsByRestaurant?Restaurant_Id=9b056ea8-04c3-4d5a-a66d-7aa28bfa9e28', false);
            if (!data.products.length) {
                addToastr('El restaurante no tiene productos disponibles', 'info');
            }                            
            setProducts(JSON.parse(data.products));
            
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [products, addToastr, getApiData])

    useEffect( () => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#E94040');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#E94040');
        setIsLoading(false);
        getProducts();
        setMenuConfig({
            active: false
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleButtonMenu: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        const menuOpts = document.querySelectorAll('.button_menu');
        menuOpts.forEach(element => {
            element.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        asideMenuRef.current?.classList.remove('visible');
        
        setFilter(e.currentTarget.value);

    }, []);

    const menuButtonComponents = useMemo(() => (
        <>
            <li>
                <button className='button_menu button_category active' onClick={handleButtonMenu}>
                    <TbHandFinger size={20} /> 
                    Todos los productos
                </button>
            </li>
            {products.map(category => category.Subcategories ?(            
                <li key={category.Id}>
                    <button
                        value={category.Id}
                        className='button_menu button_category'
                        onClick={handleButtonMenu}
                    >
                        <TbHandFinger size={20} />
                        {category.Name}
                    </button>
                </li>
            ) : null)}
        </>
    ), [products, handleButtonMenu]);

    const handleMenu = () => {
        asideMenuRef.current?.classList.toggle('visible');
    }

    const handleStoreOut = () => {
        navigate('/');
    }

    return (
        <div className='wrapper_store'>
            <header className='header_mobile'>
                <div>
                    <img src={imgLogo} alt='Logo el piloncito' draggable='false' width={50} />
                    <div>
                        <h1>El Piloncito</h1>
                        <h2>COMIDAS RAPIDAS</h2>
                    </div>
                </div>
                <button className='open_menu'>
                    <TbMenu2 size={30} onClick={handleMenu}/>
                </button>
            </header>
            <aside className='aside_menu' ref={asideMenuRef}>
                <button className='close_menu'>
                    <MdClose size={30} onClick={handleMenu}/>
                </button>
                <button className='store_out'>
                    <BiRedo size={30} onClick={handleStoreOut}/>
                </button>
                <header className='aside_menu_header'>
                    <img src={imgLogo} alt='Logo el piloncito' draggable='false' width={90} />
                </header>
                <nav>
                    <ul className='store_menu'>
                        <li>
                            <button className='button_menu button_cart'><FaShoppingCart size={20}/> <span>0</span> Carrito</button>
                        </li>
                        {menuButtonComponents}
                    </ul>
                </nav>
            </aside>
            <main className='container_store'>
                <div className='container_products'>
                    <CartProducts products={products} filter={filter} />
                </div>
            </main>
        </div>
    );
}

export { Store };