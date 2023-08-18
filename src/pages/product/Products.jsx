import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { SectionProducts } from '../../components/SectionProducts';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';
import imgProducts from '../../assets/images/headerOptions/Products.svg';

function Products() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [catAndSubcat, setCatAndSubcat] = React.useState([]);
    const [changeProducts, setChangeProducts] = React.useState('');
    const MemoizedTiDelete = React.memo(TiDelete);
    
    const getProducts = React.useCallback(async () => {
        if (catAndSubcat.length !== 0) {
            return;
        }
        try {
            const data = await getApiData('Subcategory/GetSubcategoriesByCategories', true);
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }                            
            setCatAndSubcat(data.subcategories);
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [catAndSubcat, addToastr, getApiData])

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);
    
    const handleAddProduct = React.useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditProduct = React.useCallback((id) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteProduct = React.useCallback(async (id) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> el producto?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        })
        
        if (isConfirmed) {
            try {
                const body = { 
                    'product_Id': id 
                }
                const data = await postApiData('Product/DeleteProduct', body, true, 'application/json');
                setChangeProducts(id);              
                addToastr(data.rpta);
            } catch (error) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr]);

    const memoizedHandleEditProduct = React.useMemo(
        () => (id) => handleEditProduct(id),
        [handleEditProduct]
    );

    const memoizedHandleDeleteProduct = React.useMemo(
        () => (id) => handleDeleteProduct(id),
        [handleDeleteProduct]
    );

    const catAndSubcatComponents = React.useMemo(() => (
        catAndSubcat.map(category => (
            JSON.parse(category.SubCategories).length > 0 &&
            <SectionProducts
                key={category.Id}
                category={category}
                onEdit={memoizedHandleEditProduct}
                onDelete={memoizedHandleDeleteProduct}
                reload={changeProducts}
            />
        ))
    ), [catAndSubcat, memoizedHandleEditProduct, memoizedHandleDeleteProduct, changeProducts]);

    return (
        <div className='page_container'>
            <Header logo={imgProducts} title='Productos' />
            <Button name='Agregar Producto' onClick={handleAddProduct} icon='add' dark />

            {catAndSubcatComponents}
        </div>
    );
}

export { Products };