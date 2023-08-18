import React from 'react';
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

function Sectors() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [sectors, setSectors] = React.useState([]);
    const MemoizedTiDelete = React.memo(TiDelete);

    const getSectors = React.useCallback(async () => {
        if (sectors.length !== 0) {
            return;
        }
        try {
            const data = await getApiData('Sector/GetSectorsByUser', true);
            if (!data.sectors.length) {
                addToastr('Registra tu primer sector', 'info');
            }
            setSectors(data.sectors);
        } catch (error) {
            addToastr(`Error: ${error}`, 'error');
        }
    }, [sectors, addToastr, getApiData])
    
    React.useEffect(() => {
        setMenuConfig(() => ({
            path: '/home/settings',
            option: 'settings'
        }));
        getSectors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleAddSector = React.useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditSector = React.useCallback((id) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteSector = React.useCallback(async (id) => {
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
                const body = { 
                    'sector_Id': id 
                }
                const data = await postApiData('Sector/DeleteSector', body, true, 'application/json');
                const updatedList = sectors.filter(table => table.Id !== id);
                setSectors(updatedList);              
                addToastr(data.rpta);
            } catch (error) {
                addToastr(error.message, error.type || 'error');
            }
        }            
    }, [postApiData, addToastr, sectors]);

    const memoizedHandleEditSector = React.useMemo(
        () => (id) => handleEditSector(id),
        [handleEditSector]
    );

    const memoizedHandleDeleteSector = React.useMemo(
        () => (id) => handleDeleteSector(id),
        [handleDeleteSector]
    );
    
    const sectorComponents = React.useMemo(() => (
        sectors.map( ({Id, Name}) => (
            <Card 
                key={Id} 
                onEdit={() => memoizedHandleEditSector(Id)} 
                onDelete={() => memoizedHandleDeleteSector(Id)} 
                name={Name} 
            />
        ))
    ), [sectors, memoizedHandleEditSector, memoizedHandleDeleteSector]);

    return (
        <div className='page_container'>
            <Header logo={imgSectors} title='Sectores' />
            <Button name='Agregar Sector' onClick={handleAddSector} icon='add' dark />

            <div className='card_container'>
                { sectorComponents }
            </div>
        </div>
    );
}

export { Sectors };