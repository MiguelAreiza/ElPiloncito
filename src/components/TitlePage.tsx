// Sources
import imgLogo from '../assets/images/Logo.svg';
import imgOrders from '../assets/images/Logo.svg';
import imgCategories from '../assets/images/headerOptions/Categories.svg';
import imgProducts from '../assets/images/headerOptions/Products.svg';
import imgSectors from '../assets/images/headerOptions/Sectors.svg';
import imgSubcategories from '../assets/images/headerOptions/Subcategories.svg';
import imgTables from '../assets/images/headerOptions/Tables.svg';
import imgUsers from '../assets/images/headerOptions/Users.svg';

interface Props {
    image: 'logo' | 'orders' | 'categories' | 'products' | 'sectors' | 'subcategories' | 'tables' | 'users'
    title: string
    color?: string
}

function TitlePage({ image, title, color }: Props) {
    const imageUrl = {
        logo: imgLogo,
        orders: imgOrders,
        categories: imgCategories,
        products: imgProducts,
        sectors: imgSectors,
        subcategories: imgSubcategories,
        tables: imgTables,
        users: imgUsers
    };
    
    return(
        <header className='header'>                
            <img className='header_logo' src={imageUrl[image]} alt={'logo' + title} draggable='false' width='90px' height='90px' />
            <h1 className='header_name'>El Piloncito</h1>
            <h2 style={{color: color}} className='header_title'>{title}</h2>
        </header> 
    );
}

export { TitlePage };