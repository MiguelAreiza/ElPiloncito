import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from './states';
import { Menu } from '../components/Menu';
// Sources
import axios from 'axios';

const AuthContext = React.createContext();

function AuthProvider({ children }) {	
	const navigate = useNavigate();
	const { setIsLoading, addToastr, menuConfig } = useAppStates();
	const [user, setUser] = React.useState(JSON.parse(sessionStorage.getItem('appUser')) || null);
	const [token, setToken] = React.useState(JSON.parse(sessionStorage.getItem('token')) || null);
	const path = 'https://elpiloncito.somee.com/';
	// const path = 'https://localhost:7027/';

	const login = (appUser, token) => {		
		setUser(appUser);
		setToken(token);
		sessionStorage.setItem('appUser', JSON.stringify(appUser));
		sessionStorage.setItem('token', JSON.stringify(token));
		navigate('/home');
	};
	
	const logout = async () => {
		try {
			setIsLoading(true);
			const {data} = await axios.post(`${path}api/Auth/LogOut`, {}, { withCredentials: true });
		
			setUser(null);
			setToken(null);
			sessionStorage.removeItem('appUser');
			sessionStorage.removeItem('token');
			addToastr(data.rpta, data.cod === '-1' ? 'warning' : 'success');
			navigate('/auth/login');
		} catch (error) {
			setIsLoading(false);
			addToastr(error.message,'error');
		}
		
	};

	const validateUser = () => {
		return new Promise( (resolve, reject) => {
			axios.get(`${path}api/Auth/ValidateUserById`,{
                headers: {
                    'Authorization': `bearer ${token}`
                }
			}).then(({data})=> {
				if (data.cod === '-1') {
					logout();
					reject('Tu sesión ha sido cerrada por inactividad');
				}
				setUser(data.appUser);
				setToken(data.token);
				sessionStorage.setItem('appUser', JSON.stringify(data.appUser));
				sessionStorage.setItem('token', JSON.stringify(data.token));
				resolve(data.appUser);				
			}).catch(error => {			
				logout();
				reject('Tu sesión ha sido cerrada por inactividad');
			}); 
		});
	}
	
	const auth = { path, user, token, login, logout, validateUser };

	return (
		<AuthContext.Provider value={auth}>
			<Menu config={menuConfig} role={auth.user ? auth.user.roleId.toUpperCase() : ''} />
			{children}
		</AuthContext.Provider>		
	);
}

function useAuth() {
	const auth = React.useContext(AuthContext);
	return auth;
}

function AuthRoute(props) {
	const auth = useAuth();
	if (!auth.user || !auth.token) {
		return <Navigate to='/auth/login' />;
	}
	return props.children;
}

export {
	AuthProvider,
	AuthRoute,
	useAuth,
};