import React from 'react';

// Components
import { useAppStates } from './states';
import { useAuth } from './auth';
// Sources
import axios from 'axios';

const ApiContext = React.createContext();

function ApiProvider({ children }) {	
    const { path, token } = useAuth();
    const { setIsLoading, addToastr } = useAppStates();
    const api = axios.create({
        baseURL: `${path}api/`,
        withCredentials: true
    });

    const handleApiResponse = response => {
        if (response.data.cod === '-1') {
            addToastr(response.data.rpta, 'warning');
        }
        setIsLoading(false);
        return response.data;
    };

    const handleApiError = error => {
        setIsLoading(false);
        addToastr('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.', 'error');

        // throw new Error('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.');
    };
    
    const getApiData = async (endPoint, isAuth) => {
        setIsLoading(true);
        const config = isAuth ? {headers:{Authorization:`Bearer ${token}`}} : null;
        try {
            const response = await api.get(endPoint, config);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    };
    
    const postApiData = async (path, body, isAuth, type) => {
        setIsLoading(true);
        const config = isAuth ? {
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-Type': type
            }
        } : {
            headers:{
                'Content-Type': type
            }
        };

        try {
            const response = await api.post(path, body, config);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    };

	const apiData = { getApiData, postApiData };

	return (
		<ApiContext.Provider value={apiData}>
			{children}
		</ApiContext.Provider>		
	);
}

function useApi() {
	const auth = React.useContext(ApiContext);
	return auth;
}

export {
	ApiProvider,
	useApi
};