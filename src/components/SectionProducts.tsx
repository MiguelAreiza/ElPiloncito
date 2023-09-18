import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Card } from './Card';
// Styles
import '../styles/SectionProducts.css';

interface Category {
    Id: string
    Name: string
    SubCategories: string
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

interface Props {
    category: Category
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    reload: string
}

function SectionProducts({ category, onEdit, onDelete, reload }: Props) {
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const [products, setProducts] = useState<Array<Product>>([]);

    const sliderSubcategoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sliderSubcategoriesRef.current) {
            sliderSubcategoriesRef.current.style.justifyContent = sliderSubcategoriesRef.current.scrollWidth > sliderSubcategoriesRef.current.clientWidth ? 'left' : 'center';
        }

        const btnCat: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.subcategory_option.selected');
        btnCat.forEach( btn => {
            btn.click();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, [reload]);

    const handleLoadProduct = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        try {
            const data = await getApiData(`Product/GetProductsBySubcategory?Subcategory_Id=${id}`, true);
            setProducts(data.products);
            const parent = e.currentTarget.parentElement;
            parent!.querySelectorAll('.selected').forEach( element => {
                element.classList.remove('selected');
            });
            e.currentTarget.classList.add('selected');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [addToastr, getApiData]);

    const categoryComponents = useMemo(() => (
        JSON.parse(category.SubCategories).map( (subcategory: Category, index: number) => (
            <button
                key={subcategory.Id}
                className={`subcategory_option ${index === 0 ? 'selected' : ''}`}
                onClick={(e) => handleLoadProduct(e, subcategory.Id)}
            >
                {subcategory.Name}
            </button>
        ))
    ), [category, handleLoadProduct]);
    
    const productComponents = useMemo(() => (
        products.map( product => (
            <Card
                key={product.Id}
                onEdit={ () => onEdit(product.Id)}
                onDelete={ () => onDelete(product.Id)}
                type='basic'
                item={{name: product.Name}}
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