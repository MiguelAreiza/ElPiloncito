import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Card } from '../components/Card';
// Styles
import '../styles/SectionProducts.css';

function SectionProducts({ category, onEdit, onDelete, reload }) {
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const [products, setProducts] = React.useState([]);

    const sliderSubcategoriesRef = React.useRef(null);

    React.useEffect(() => {
        if (sliderSubcategoriesRef.current) {
            sliderSubcategoriesRef.current.style.justifyContent = sliderSubcategoriesRef.current.scrollWidth > sliderSubcategoriesRef.current.clientWidth ? 'left' : 'center';
        }

        const btnCat = document.querySelectorAll('.subcategory_option.selected');
        btnCat.forEach( btn => {
            btn.click();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, [reload]);

    const handleLoadProduct = React.useCallback(async (e, id) => {
        try {
            const data = await getApiData(`Product/GetProductsBySubcategory?Subcategory_Id=${id}`, true);
            setProducts(data.products);
            const parent = e.target.parentElement;
            parent.querySelectorAll('.selected').forEach( element => {
                element.classList.remove('selected');
            });
            e.target.classList.add('selected');
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [addToastr, getApiData]);

    const memoizedhandleLoadProduct = React.useMemo(
        () => (e, id) => handleLoadProduct(e, id),
        [handleLoadProduct]
    );

    const categoryComponents = React.useMemo(() => (
        JSON.parse(category.SubCategories).map( (subcategory, index) => (
            <button
                key={subcategory.Id}
                className={`subcategory_option ${index === 0 ? 'selected' : ''}`}
                onClick={(e) => memoizedhandleLoadProduct(e, subcategory.Id)}
            >
                {subcategory.Name}
            </button>
        ))
    ), [category, memoizedhandleLoadProduct]);
    
    const productComponents = React.useMemo(() => (
        products.map( product => (
            <Card
                key={product.Id}
                onEdit={ () => onEdit(product.Id)}
                onDelete={ () => onDelete(product.Id)}
                name={product.Name}
            />
        ))
    ), [products, onEdit, onDelete]);

    return (
        <div className='category_section' >
            <h3 className='category_name'>{category.Name}</h3>
            <div className='subcategories_slider' ref={sliderSubcategoriesRef}>
                { categoryComponents }
            </div>
            <div className='card_container'>
                { productComponents }
            </div>
        </div>
    );
}

export { SectionProducts };