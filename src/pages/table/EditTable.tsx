import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForTable } from '../../components/FormForTable';

interface EditTableData {
    Table_Id: string
    Name: string
    Capacity: number
    Available: boolean
}

function EditTable() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig({
            path: '/home/settings/tables',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleEditTable = React.useCallback(async (table: EditTableData) => {
        try {
            const body = {
                'table_Id': table.Table_Id,
                'name': table.Name,
                'capacity': table.Capacity,
                'available': table.Available
            };
            const data: ResponseApi = await postApiData('Table/UpdateTable', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/tables');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='tables' title='Editar Mesa' />
            <FormForTable onEdit={handleEditTable} />
        </div>
    );
}

export { EditTable };