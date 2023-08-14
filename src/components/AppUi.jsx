import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import { StatesProvider } from '../helpers/states';
import { AuthProvider, AuthRoute } from '../helpers/auth';
import { ApiProvider } from '../helpers/api';
// Routes
import { LandingPage } from '../pages/LandingPage';
import { Delivery } from '../pages/Delivery';
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
import { Sectors } from '../pages/Sectors';
import { NewSector } from '../pages/NewSector';
import { EditSector } from '../pages/EditSector';
import { Actions } from '../pages/Actions';
import { TakeOrder } from '../pages/TakeOrder';
import { PendingOrders } from '../pages/PendingOrders';
import { Accounting } from '../pages/Accounting';
import { IncomeAndExpensesForm } from '../components/IncomeAndExpensesForm';
import { Default } from '../pages/Default';

function AppUi() { 
    return (
        <BrowserRouter basename='/'>
        <StatesProvider>
        <AuthProvider>
        <ApiProvider>
        <Routes>
            <Route path='/' element={<LandingPage />} />

            <Route path='/delivery' element={<Delivery />} />

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

            <Route path='/home/settings/sectors' element={<AuthRoute> <Sectors /> </AuthRoute>} />
            <Route path='/home/settings/sectors/new' element={<AuthRoute> <NewSector /> </AuthRoute>} />
            <Route path='/home/settings/sectors/edit/:id' element={<AuthRoute> <EditSector /> </AuthRoute>} />

            <Route path='/home/actions' element={<AuthRoute> <Actions /> </AuthRoute>} />
            <Route path='/home/actions/takeOrder' element={<AuthRoute> <TakeOrder /> </AuthRoute>} />
            <Route path='/home/actions/pendingOrders' element={<AuthRoute> <PendingOrders /> </AuthRoute>} />
            
            <Route path='/home/accounting' element={<AuthRoute> <Accounting /> </AuthRoute>} >
                <Route path='income' element={<AuthRoute> <IncomeAndExpensesForm /> </AuthRoute>} />
                <Route path='expenses' element={<AuthRoute> <IncomeAndExpensesForm /> </AuthRoute>} />
            </Route>

            <Route path='*' element={<Default />} />
        </Routes>
        </ApiProvider>
        </AuthProvider>
        </StatesProvider>
        </BrowserRouter>
    )
};

export { AppUi };