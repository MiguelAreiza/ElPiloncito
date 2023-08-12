import React from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
// Sources
import Swal from 'sweetalert2';
import imgTables from '../assets/images/headerOptions/Tables.svg';

function Tables() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [tables, setTables] = React.useState([]);
    const MemoizedTiDelete = React.memo(TiDelete);
    
    const getTables = React.useCallback(async () => {
        try {
            const data = await getApiData('Table/GetTablesByUser', true);
            if (!data.tables.length) {
                addToastr('Registra tu primera mesa', 'info');
            }
            setTables(data.tables);
        } catch (error) {
            addToastr(`Error: ${error}`, 'error');
        }
    }, [addToastr, getApiData])
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        getTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);
    
    const handleAddTable = React.useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditTable = React.useCallback((id) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteTable = React.useCallback((id) => {
        Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la mesa?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then(async({isConfirmed}) => {
            if (isConfirmed) {
                try {
                    const body = {
                        table_Id: id,
                    }
                    const data = await postApiData('Table/DeleteTable', body, true, 'application/json');
                    const updatedList = tables.filter(table => table.Id !== id);
                    setTables(updatedList);              
                    addToastr(data.rpta);
                } catch (error) {
                    addToastr(`Error: ${error}`, 'error');
                }
            }
        });
    }, [postApiData, addToastr, tables]);

    const memoizedHandleEditTable = React.useMemo(
        () => (id) => handleEditTable(id),
        [handleEditTable]
    );

    const memoizedHandleDeleteTable = React.useMemo(
        () => (id) => handleDeleteTable(id),
        [handleDeleteTable]
    );

    return (
        <div className='page_container'>
            <Header logo={imgTables} title='Mesas' />
            <Button name='Agregar Mesa' onClick={handleAddTable} icon='add' dark />

            <div className='card_container'>
                {tables.map( ({Id, Name}) => (
                    <Card key={Id} onEdit={() => memoizedHandleEditTable(Id)} onDelete={() => memoizedHandleDeleteTable(Id)} name={Name} />
                ))}
            </div>
        </div>
    );
}

export { Tables };