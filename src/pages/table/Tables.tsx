import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { TiDelete } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';

interface Table {
    Id: string
    Name: string
    Capacity: number
    Available: boolean
}

interface GetTablesData {
    tables: Array<Table>;
    cod: string;
}

function Tables() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [tables, setTables] = useState<Array<Table>>([]);
    const MemoizedTiDelete = memo(TiDelete);
    
    const getTables = useCallback(async () => {
        if (tables.length !== 0) {
            return;
        }
        try {
            const data: GetTablesData = await getApiData('Table/GetTablesByUser', true);
            if (!data.tables.length) {
                addToastr('Registra tu primera mesa', 'info');
            }
            setTables(data.tables);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [tables, addToastr, getApiData])
    
    useEffect(() => {
        setMenuConfig({
            path: '/home/settings',
            option: 'settings'
        });
        getTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleAddTable = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditTable = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteTable = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> la mesa?</div>`,
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
                const body = { 'table_Id': id }
                const data: ResponseApi = await postApiData('Table/DeleteTable', body, true, 'application/json');
                setTables(prevTables => prevTables.filter(table => table.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }            
    }, [postApiData, addToastr, MemoizedTiDelete]);

    const tableComponents: React.JSX.Element[] = useMemo(() => (
        tables.map(({ Id, Name }) => (
            <Card 
                key={Id} 
                onEdit={() => handleEditTable(Id)} 
                onDelete={() => handleDeleteTable(Id)} 
                type='basic'
                item={{ name: Name }}
            />
        ))
    ), [tables, handleEditTable, handleDeleteTable]);

    return (
        <div className='page_container'>
            <TitlePage image='tables' title='Mesas' />
            <Button name='Agregar Mesa' type='button' onClick={handleAddTable} icon='add' template='dark' />

            <div className='card_container'>
                { tableComponents }
            </div>
        </div>
    );
}

export { Tables };