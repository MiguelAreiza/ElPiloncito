import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { TitlePage } from '../../components/TitlePage';
import { FormForTable } from '../../components/FormForTable';

interface NewTableData {
    Name: string
    Capacity: number
    Available: boolean
}

function NewTable() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/tables',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleCreateTable = useCallback(async (table: NewTableData) => {
        try {
            const body = {
                'name': table.Name,
                'capacity': table.Capacity,
                'available': table.Available       
            };
            const data: ResponseApi = await postApiData('Table/CreateTable', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/tables');  
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <TitlePage image='tables' title='Nueva Mesa' />
            <FormForTable onCreate={handleCreateTable} />
        </div>
    );
}

export { NewTable };