import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import { AuthProvider, AuthRoute } from '../helpers/auth';
import { StatesProvider, useAppStates } from '../helpers/states';
import { Menu } from '../components/Menu';
// Routes
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Recovery } from '../pages/Recovery';
import { ConfirmEmail } from '../pages/ConfirmEmail';
import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { Categories } from '../pages/Categories';
import { NewCategory } from '../pages/NewCategory';
import { EditCategory } from '../pages/EditCategory';
import { Subcategories } from '../pages/Subcategories';
import { NewSubcategory } from '../pages/NewSubcategory';
import { EditSubcategory } from '../pages/EditSubcategory';
import { Products } from '../pages/Products';
import { NewProduct } from '../pages/NewProduct';
import { EditProduct } from '../pages/EditProduct';
import { Tables } from '../pages/Tables';
import { NewTable } from '../pages/NewTable';
import { EditTable } from '../pages/EditTable';
import { Activities } from '../pages/Activities';
import { TakeOrder } from '../pages/TakeOrder';
import { Default } from '../pages/Default';

function AppUi() {
    return (
        <BrowserRouter basename='/'>
            <StatesProvider>
                <AuthProvider>
                    <MenuWrapper />
                    <Routes>
                        
                        <Route path='/' element={<LandingPage />} />

                        <Route path='/auth/login' element={<Login />} />
                        <Route path='/auth/recovery' element={<Recovery />} />
                        <Route path='/auth/confirmEmail/:id' element={<ConfirmEmail />} />

                        <Route path='/home' element={<AuthRoute> <Home /> </AuthRoute>} />

                        <Route path='/home/settings' element={<AuthRoute> <Settings /> </AuthRoute>} />

                        <Route path='/home/settings/categories' element={<AuthRoute> <Categories /> </AuthRoute>} />
                        <Route path='/home/settings/categories/new' element={<AuthRoute> <NewCategory /> </AuthRoute>} />
                        <Route path='/home/settings/categories/edit/:id' element={<AuthRoute> <EditCategory /> </AuthRoute>} />
                        
                        <Route path='/home/settings/subcategories' element={<AuthRoute> <Subcategories /> </AuthRoute>} />
                        <Route path='/home/settings/subcategories/new' element={<AuthRoute> <NewSubcategory /> </AuthRoute>} />
                        <Route path='/home/settings/subcategories/edit/:id' element={<AuthRoute> <EditSubcategory /> </AuthRoute>} />
                        
                        <Route path='/home/settings/products' element={<AuthRoute> <Products /> </AuthRoute>} />
                        <Route path='/home/settings/products/new' element={<AuthRoute> <NewProduct /> </AuthRoute>} />
                        <Route path='/home/settings/products/edit/:id' element={<AuthRoute> <EditProduct /> </AuthRoute>} />

                        <Route path='/home/settings/tables' element={<AuthRoute> <Tables /> </AuthRoute>} />
                        <Route path='/home/settings/tables/new' element={<AuthRoute> <NewTable /> </AuthRoute>} />
                        <Route path='/home/settings/tables/edit/:id' element={<AuthRoute> <EditTable /> </AuthRoute>} />

                        <Route path='/home/activities' element={<AuthRoute> <Activities /> </AuthRoute>} />
                        <Route path='/home/activities/takeOrder' element={<AuthRoute> <TakeOrder /> </AuthRoute>} />

                        <Route path='*' element={<Default />} />

                    </Routes>
                </AuthProvider>
            </StatesProvider>   
        </BrowserRouter>
    );
}

function MenuWrapper() {
    const { menuConfig } = useAppStates();
    return <Menu config={menuConfig} />;
}

export { AppUi };
