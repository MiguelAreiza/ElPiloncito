import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForTable } from '../../components/FormForTable';
// Sources
import imgTables from '../../assets/images/headerOptions/Tables.svg';

function NewTable() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/tables',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateTable = React.useCallback(async (name, capacity, available) => {
        try {
            const body = {
                'name': name,
                'capacity': capacity,
                'available': available       
            };
            const data = await postApiData('Table/CreateTable', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/tables');  
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleCreateTable = React.useMemo(
        () => (name, capacity, available) => handleCreateTable(name, capacity, available),
        [handleCreateTable]
    );

    return (
        <div className='page_container'>
            <Header logo={imgTables} title='Mesas' />
            <FormForTable onCreate={memoizedHandleCreateTable} />
        </div>
    );
}

export { NewTable };