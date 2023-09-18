import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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

interface Category {
    Id: string
    Name: string
    SubCategories: string
}

interface GetCatAndSubcatsData {
    subcategories: Array<Category>;
    cod: string;
}

function Products() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [catAndSubcat, setCatAndSubcat] = useState<Array<Category>>([]);
    const [changeProducts, setChangeProducts] = useState<string>('');
    const MemoizedTiDelete = memo(TiDelete);
    
    const getCatAndSubcat = useCallback(async () => {
        if (catAndSubcat.length !== 0) {
            return;
        }
        try {
            const data: GetCatAndSubcatsData = await getApiData('Subcategory/GetSubcategoriesByCategories', true);
            if (!data.subcategories.length) {
                addToastr('Registra tu primera subcategoría', 'info');
            }                            
            setCatAndSubcat(data.subcategories);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [catAndSubcat, addToastr, getApiData])

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings',
            option: 'settings'
        });
        getCatAndSubcat();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);
    
    const handleAddProduct = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditProduct = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteProduct = useCallback(async (id: string) => {
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
                const body = { 'product_Id': id }
                const data: ResponseApi = await postApiData('Product/DeleteProduct', body, true, 'application/json');
                setChangeProducts(id);              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    const catAndSubcatComponents: (React.JSX.Element | false)[] = useMemo(() => (
        catAndSubcat.map(category => (
            JSON.parse(category.SubCategories).length > 0 &&
            <SectionProducts
                key={category.Id}
                category={category}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                reload={changeProducts}
            />
        ))
    ), [catAndSubcat, handleEditProduct, handleDeleteProduct, changeProducts]);

    return (
        <div className='page_container'>
            <Header logo={imgProducts} title='Productos' />
            <Button name='Agregar Producto' type='button' onClick={handleAddProduct} icon='add' template='dark' />

            {catAndSubcatComponents}
        </div>
    );
}

export { Products };