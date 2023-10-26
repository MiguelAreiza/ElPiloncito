import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { AiOutlineHeart, AiFillHeart, AiFillEye } from 'react-icons/ai';

// Components
import { useAuth } from '../helpers/auth';
import { valueToCurrency } from '../helpers/functions';
// Styles
import '../styles/Store.css';
// Sources
import imgDefaultProduct from '../assets/images/headerOptions/Products.svg';
import { Card, Skeleton } from 'antd';

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

interface Props {
    products: Array<Category>
    filter: string
}

interface CardProps {
    product: Product
}

function CardProduct({ product }: CardProps)  {
    const { path } = useAuth();
    const [see, setSee] = useState(false);
    const [like, setLike] = useState(false);

    const handleSee = () => {
        setSee(!see)
    }
    
    const handleLike = () => {
        setLike(!like)
    }

    return (
        <Card
            hoverable
            cover={<img src={product.ImageUrl ? `${path}AssetsImage/${product.ImageUrl}` : imgDefaultProduct} alt={`imagen ${product.Name} el pilonito`} width='150px' height='150px' /> }
            actions={[ like 
                ? <AiFillHeart className='card_action' size={15} color='var(--principal)' onClick={handleLike} />
                : <AiOutlineHeart className='card_action' size={15} color='var(--principal)' onClick={handleLike} />,
                <AiFillEye className='card_action' size={15} color={see ? '#3498db' : ''} key='See' onClick={handleSee} />,
                <FaShoppingCart className='card_action' size={15} color='var(--green)' />
            ]}
        >
            <Card.Meta
                title={product.Name}
                description={
                    <div className={`product_description ${see ? 'active' : ''}`}>
                        <p> {product.Description} </p>
                        <b> {valueToCurrency(product.Price)} </b>
                    </div>
                }                                    
            />
        </Card>
    )
}

function CartProducts({ products, filter }: Props) {

    return products.length === 0 ? (
        <>
            {[1,2,3,4,5,6].map((i) => (
                <Card
                    key={i} 
                    loading
                    cover={<Skeleton.Image active style={{width: '150px', height: '150px'}} /> }
                    actions={[
                        <Skeleton.Button active size='small' shape='circle' key='setting' />,
                        <Skeleton.Button active size='small' shape='circle' key='edit' />,
                        <Skeleton.Button active size='small' shape='circle' key='ellipsis' />,
                    ]}
                />
            ))}
        </>
    ) : (
        <>
            {products.map(category => {
                if (filter !== '' && category.Id.toUpperCase() !== filter.toUpperCase()) {
                    return null
                }
                return (
                    <div className='container_category' key={category.Id}>
                        <h2>{category.Name}</h2>
                        {category.Subcategories.map(subcategory => (
                            <div className='container_subcategory' key={subcategory.Id}>
                                <h3>{subcategory.Name}</h3>
                                {subcategory.Products.map(product => (
                                    <CardProduct key={product.Id} product={product} />
                                ))}
                            </div>
                        ))}                        
                    </div>
                )
            })}
        </>
    );
}

export { CartProducts };