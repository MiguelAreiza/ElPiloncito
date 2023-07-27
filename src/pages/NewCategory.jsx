import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { CategoryForm } from '../components/CategoryForm';
// Sources
import axios from 'axios';
import imgCategories from '../assets/images/headerOptions/Categories.svg';

function NewCategory() {    
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { path, token } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/categories',
            option: 'settings'
        }));
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (name, active) => {        
        setIsLoading(true);
        axios.post(`${path}api/Category/CreateCategory`, {
            name: name,
            active: active       
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            withCredentials: true
        }).then( ({data}) => {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }                  
            addToastr(data.rpta);
            navigate('/home/settings/categories');         
        }).catch(error => {
            setIsLoading(false);
            addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');
        }); 
    }

    return (
        <div className='page_container'>
            <Header logo={imgCategories} title='Categorías' />
            <CategoryForm onCreate={handleClickCreate} />
        </div>
    );
}

export { NewCategory };
