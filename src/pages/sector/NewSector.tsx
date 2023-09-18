import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForSector } from '../../components/FormForSector';
// Sources
import imgSectors from '../../assets/images/headerOptions/Sectors.svg';

interface NewSectorData {
    Name: string
    Price: string
    Active: boolean
}

function NewSector() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/sectors',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleCreateSector = useCallback(async (sector: NewSectorData) => {
        try {
            const body = {
                'name': sector.Name,
                'price': sector.Price.replace('$ ','').replace(',',''),
                'active': sector.Active       
            };
            const data: ResponseApi = await postApiData('Sector/CreateSector', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/sectors'); 
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectore' />
            <FormForSector onCreate={handleCreateSector} />
        </div>
    );
}

export { NewSector };