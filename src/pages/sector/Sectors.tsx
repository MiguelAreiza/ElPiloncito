import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import imgSectors from '../../assets/images/headerOptions/Sectors.svg';

interface Sector {
    Id: string
    Name: string
    Price: number
    Active: boolean
}

interface GetSectorsData {
    sectors: Array<Sector>;
    cod: string;
}

function Sectors() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [sectors, setSectors] = useState<Array<Sector>>([]);
    const MemoizedTiDelete = memo(TiDelete);

    const getSectors = useCallback(async () => {
        if (sectors.length !== 0) {
            return;
        }
        try {
            const data: GetSectorsData = await getApiData('Sector/GetSectorsByUser', true);
            if (!data.sectors.length) {
                addToastr('Registra tu primer sector', 'info');
            }
            setSectors(data.sectors);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [sectors, addToastr, getApiData])
    
    useEffect(() => {
        setMenuConfig({
            path: '/home/settings',
            option: 'settings'
        });
        getSectors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleAddSector = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditSector = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteSector = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>Eliminar</b> el sector?</div>`,
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
                const body = { 'sector_Id': id }
                const data: ResponseApi = await postApiData('Sector/DeleteSector', body, true, 'application/json');
                setSectors(prevSectors => prevSectors.filter(sector => sector.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }            
    }, [postApiData, addToastr, MemoizedTiDelete]);

    const sectorComponents = useMemo(() => (
        sectors.map( ({ Id, Name }) => (
            <Card 
                key={Id} 
                onEdit={() => handleEditSector(Id)} 
                onDelete={() => handleDeleteSector(Id)} 
                type='basic'
                item={{ name: Name }}
            />
        ))
    ), [sectors, handleEditSector, handleDeleteSector]);

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectores' />
            <Button name='Agregar Sector' type='button' onClick={handleAddSector} icon='add' template='dark' />

            <div className='card_container'>
                { sectorComponents }
            </div>
        </div>
    );
}

export { Sectors };