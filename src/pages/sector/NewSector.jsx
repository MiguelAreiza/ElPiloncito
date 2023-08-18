import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForSector } from '../../components/FormForSector';
// Sources
import imgSectors from '../../assets/images/headerOptions/Sectors.svg';

function NewSector() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/sectors',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateSector = React.useCallback(async (name, price, active) => {
        try {
            const body = {
                'name': name,
                'price': price.replace('$ ','').replace(',',''),
                'active': active       
            };
            const data = await postApiData('Sector/CreateSector', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/sectors'); 
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleCreateSector = React.useMemo(
        () => (name, price, active) => handleCreateSector(name, price, active),
        [handleCreateSector]
    );

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectores' />
            <FormForSector onCreate={memoizedHandleCreateSector} />
        </div>
    );
}

export { NewSector };
