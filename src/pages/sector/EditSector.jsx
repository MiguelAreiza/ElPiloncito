import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForSector } from '../../components/FormForSector'
// Sources
import imgSectors from '../../assets/images/headerOptions/Sectors.svg';

function EditSector() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings/sector',
            option: 'settings'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditSector = React.useCallback(async (id, name, price, active) => {
        try {
            const body = {
                'sector_Id': id,
                'name': name,
                'price': price.replace('$ ','').replace(',',''),
                'active': active
            };
            const data = await postApiData('Sector/UpdateSector', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/sectors');
        } catch (error) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    const memoizedHandleEditSector = React.useMemo(
        () => (id, name, price, active) => handleEditSector(id, name, price, active),
        [handleEditSector]
    );

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectores' />
            <FormForSector onEdit={memoizedHandleEditSector} />
        </div>
    );

}

export { EditSector };
