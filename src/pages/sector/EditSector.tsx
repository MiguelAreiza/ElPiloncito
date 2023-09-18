import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForSector } from '../../components/FormForSector'
// Sources
import imgSectors from '../../assets/images/headerOptions/Sectors.svg';

interface EditSectorData {
    Sector_Id: string
    Name: string
    Price: string
    Active: boolean
}

function EditSector() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/sectors',
            option: 'settings'
        });
    }, [setMenuConfig]);

    const handleEditSector = useCallback(async (sector: EditSectorData) => {
        try {
            const body = {
                'sector_Id': sector.Sector_Id,
                'name': sector.Name,
                'price': sector.Price.replace('$ ','').replace(',',''),
                'active': sector.Active
            };
            const data: ResponseApi = await postApiData('Sector/UpdateSector', body, true, 'application/json');
            addToastr(data.rpta);
            navigate('/home/settings/sectors');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectore' />
            <FormForSector onEdit={handleEditSector} />
        </div>
    );
}

export { EditSector };