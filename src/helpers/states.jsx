import React from 'react';

// Components
import { PageContent } from '../components/PageContent';
import { Spinner } from '../components/Spinner';
import { Toastr } from '../components/Toastr';
import { CookiesConsent } from '../components/CookiesConsent';
// Sources
import { v4 as uuidv4 } from 'uuid';
import { useJsApiLoader } from '@react-google-maps/api';

const statesContext = React.createContext();
const libraries = process.env.REACT_APP_GOOGLE_MAPS_API_LIBRARIES.split(',');
const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function StatesProvider({ children }) {
    const { isLoaded: mapIsLoaded } = useJsApiLoader({
        googleMapsApiKey: key, 
        libraries: libraries
    });
	const [isLoading, setIsLoading] = React.useState(true);
    const [toastrList, setToastrList] = React.useState([]);
	const [menuConfig, setMenuConfig] = React.useState({ path:'', home:false, basic:false, active:true });
	const [isOnline, setIsOnline] = React.useState(navigator.onLine);
	const [cookiesConsent, setCookiesConsent] = React.useState(JSON.parse(localStorage.getItem('Allow-Cookies')));

	React.useEffect(() => {
		const handleOnlineStatus = () => {
			setIsOnline(navigator.onLine);
		};
		
		window.addEventListener('online', handleOnlineStatus);
		window.addEventListener('offline', handleOnlineStatus);
	
		return () => {
			window.removeEventListener('online', handleOnlineStatus);
			window.removeEventListener('offline', handleOnlineStatus);
		};
	}, []);

    const addToastr = (message, type, time) => {
        const id = uuidv4();        
        const newToastrList = [...toastrList];
        newToastrList.push({ message, type, time, id });
        setToastrList(newToastrList);
    };

	const newId = () => {
		return uuidv4();
	}

	const states = { setIsLoading, addToastr, menuConfig, setMenuConfig, isOnline, newId, mapIsLoaded };

	return (
		<statesContext.Provider value={states}>
			<PageContent>
				{children}
			</PageContent>

			{ isLoading ? <Spinner /> : null}

			<CookiesConsent cookiesConsent={cookiesConsent} setCookiesConsent={setCookiesConsent} />
                
			<div className='notifications'>
				{
					toastrList.map( toastr => {
						return (
							<Toastr
								key={toastr.id}
								message={toastr.message}
								type={toastr.type}
								time={toastr.time}
							/>
						);
					})
				}
			</div>
		</statesContext.Provider>		
	);
}

function useAppStates() {
	const appStates = React.useContext(statesContext);
	return appStates;
}

export {
	StatesProvider,
	useAppStates
};