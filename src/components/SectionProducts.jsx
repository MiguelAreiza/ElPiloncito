import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Card } from '../components/Card';
// Styles
import '../styles/SectionProducts.css';
// Sources
import axios from 'axios';

function SectionProducts({ category, onEdit, onDelete, reload }) {
    const { setIsLoading, addToastr } = useAppStates();
    const { path, token} = useAuth();
    const [products, setProducts] = React.useState([]);

    const sliderSubcategoriesRef = React.useRef(null);

    React.useEffect(() => {
        const sliderSubcategories = sliderSubcategoriesRef.current;

        if (sliderSubcategories) {
            sliderSubcategories.style.justifyContent = sliderSubcategories.scrollWidth > sliderSubcategories.clientWidth ? 'left' : 'center';
        }

        const btnCat = document.querySelectorAll('.subcategory_option.selected');
        btnCat.forEach( btn => {
            btn.click();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, [reload]);

    const handleClickLoad = e => {
        const subcategoryId = e.target.dataset.subcategoryid;
        setIsLoading(true);
        axios.get(`${path}api/Product/GetProductsBySubcategory?Subcategory_Id=${subcategoryId}`, {
            headers: {
                Authorization: `bearer ${token}`
            },
            withCredentials: true
        }).then(({ data }) => {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            setProducts(data.products);
            
            const parent = e.target.parentElement;
            parent.querySelectorAll('.selected').forEach( element => {
                element.classList.remove('selected');
            });
            e.target.classList.add('selected');
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
    };
    
    return (
        <div className='category_section' >
            <h3 className='category_name'>{category.Name}</h3>
            <div className='subcategories_slider' ref={sliderSubcategoriesRef}>
                {
                    JSON.parse(category.SubCategories).map( (subcategory, index) => {
                        return(
                            <button
                                key={subcategory.Id}
                                className={`subcategory_option ${index === 0 ? 'selected' : ''}`}
                                data-subcategoryid={subcategory.Id}
                                onClick={handleClickLoad}
                            >
                                {subcategory.Name}
                            </button>
                        )
                    })
                }
            </div>
            <div className='card_container'>
                {
                    products.map( product => {
                        return(
                            <Card
                                key={product.Id}
                                onEdit={ () => onEdit(product.Id)}
                                onDelete={ () => onDelete(product.Id)}
                                name={product.Name}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}

export { SectionProducts };