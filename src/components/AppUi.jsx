import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import { AuthProvider, AuthRoute } from '../helpers/auth';
import { StatesProvider } from '../helpers/states';
// Routes
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Recovery } from '../pages/Recovery';
import { ConfirmEmail } from '../pages/ConfirmEmail';
import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { Default } from '../pages/Default';

function AppUi() {
    return (
        <BrowserRouter>
            <AuthProvider>  
                <StatesProvider>
                    <Routes>

                        <Route path='/' element={<LandingPage />} />

                        <Route path='/auth/login' element={<Login />} />
                        <Route path='/auth/recovery' element={<Recovery />} />
                        <Route path='/auth/confirmEmail/:token' element={<ConfirmEmail />} />

                        <Route path='/home' element={<AuthRoute> <Home /> </AuthRoute>} />

                        <Route path='/home/settings' element={<AuthRoute> <Settings /> </AuthRoute>} />

                        <Route path='*' element={<Default />} />

                    </Routes>
                </StatesProvider>   
            </AuthProvider>
        </BrowserRouter>
    );
}

export { AppUi };
