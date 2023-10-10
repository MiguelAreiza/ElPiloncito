import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdSettingsSuggest } from 'react-icons/md';
import { SlArrowRight } from 'react-icons/sl';

// Components
import { useAppStates } from '../helpers/states';
import { TitlePage } from '../components/TitlePage';
// Styles
import '../styles/Settings.css';

function Settings() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const configOptions = [
        {to:'/home/settings/categories', name:'Categorías'},
        {to:'/home/settings/subcategories', name:'Subcategorías'},
        {to:'/home/settings/products', name:'Productos'},
        {to:'/home/settings/tables', name:'Mesas'},
        {to:'/home/settings/sectors', name:'Sectores'},
        {to:'/home/settings/users', name:'Usuarios'}
    ];

    useEffect(() => {
        setMenuConfig({
            option: 'settings'
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOpt = useCallback(() => {
        setIsLoading(true);
    }, [setIsLoading]);

    return (
        <div className='page_container'>
            <TitlePage image='logo' title='CONFIGURACIÓN' />
            
            <div className='container_config_options'>
                {configOptions.map(option => (
                    <Link key={option.name} className='config_option' to={option.to} onClick={handleClickOpt}>
                        <MdSettingsSuggest size={40} />
                        <br/>{option.name}
                        <SlArrowRight size={25} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export { Settings };