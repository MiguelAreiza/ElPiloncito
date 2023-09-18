import { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';
import imgUsers from '../../assets/images/headerOptions/Users.svg';

interface User {
    Id: string
    Name: string
    Active: boolean
}

interface GetUsersData {
    users: Array<User>;
    cod: string;
}

function Users () {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [users, setUsers] = useState<Array<User>>([]);
    const MemoizedTiDelete = memo(TiDelete);

    const getUsers = useCallback(async () => {
        if (users.length !== 0) {
            return;
        }
        try {
            const data: GetUsersData = await getApiData('User/GetUsersByUser', true); 
            if (!data.users.length) {
                addToastr('Registra tu primer usuario', 'info');
            }
            setUsers(data.users);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [users, addToastr, getApiData]);
    
    useEffect(() => {
        setMenuConfig({
            path: '/home/settings',
            option: 'settings'
        });
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
     
    const handleAddUser = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditUser = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);
    
    const handleDeleteUser = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> el usuario?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            try {
                const body = { 'user_Id': id }
                const data: ResponseApi = await postApiData('User/DeleteUser', body, true, 'application/json');
                setUsers(prevUsers => prevUsers.filter(user => user.Id !== id));
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);
    
    const userComponents: React.JSX.Element[] = useMemo(() => (
        users.map(({ Id, Name }) => (
            <Card
                key={Id}
                onEdit={() => handleEditUser(Id)}
                onDelete={() => handleDeleteUser(Id)}
                type='basic'
                item={{ name: Name }}
            />
        ))
    ), [users, handleEditUser, handleDeleteUser]);
    
    return (
        <div className='page_container'>
            <Header logo={imgUsers} title='Usuarios' />
            <Button name='Agregar Usuario' type='button' onClick={handleAddUser} icon='add' template='dark' />

            <div className='card_container'>
                {userComponents}
            </div>
        </div>
    );
}

export { Users };