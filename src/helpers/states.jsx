import React from 'react';

// Components
import { PageContent } from '../components/PageContent';
import { Spinner } from '../components/Spinner';
import { Toastr } from '../components/Toastr';
// Sources
import { v4 as uuidv4 } from 'uuid';

const statesContext = React.createContext();

function StatesProvider({ children }) {
	const [isLoading, setIsLoading] = React.useState(true);
    const [toastrList, setToastrList] = React.useState([]);

    const addToastr = (message, type, time) => {
        const id = uuidv4();        
        const newToastrList = [...toastrList];
        newToastrList.push({ message, type, time, id });
        setToastrList(newToastrList);
    };

	const states = { setIsLoading, addToastr };

	return (
		<statesContext.Provider value={states}>
			<PageContent>
				{children}
			</PageContent>

			{ isLoading ? <Spinner /> : null}
                
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