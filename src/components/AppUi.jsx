import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import { AuthProvider, AuthRoute } from '../helpers/auth';
import { StatesProvider } from '../helpers/states';
// Routes
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
// import { Recovery } from '../pages/Recovery';
import { Home } from '../pages/Home';
// import { Restaurant } from '../pages/Restaurant';
// import { Headquarters } from '../pages/Headquarters';
// import { NewHeadquarter } from '../pages/NewHeadquarter';
// import { EditHeadquarter } from '../pages/EditHeadquarter';
// import { DigitalMenu } from '../pages/DigitalMenu';
// import { Categories } from '../pages/Categories';
// import { NewCategory } from '../pages/NewCategory';
// import { EditCategory } from '../pages/EditCategory';
// import { Subcategories } from '../pages/Subcategories';
// import { NewSubcategory } from '../pages/NewSubcategory';
// import { EditSubcategory } from '../pages/EditSubcategory';
// import { Products } from '../pages/Products';
// import { NewProduct } from '../pages/NewProduct';
// import { EditProduct } from '../pages/EditProduct';
// import { Profile } from '../pages/Profile';
// import { ChangePassword } from '../pages/ChangePass';
import { Default } from '../pages/Default';

function AppUi() {
    return (
        <BrowserRouter>
            <AuthProvider>  
                <StatesProvider>
                    <Routes>

                        <Route path='/' element={<LandingPage />} />

                        <Route path='/auth/login' element={<Login />} />

                        {/* <Route path='/auth/confirmEmail/:token' element={<ConfirmEmail />} /> */}

                        {/* <Route path='/auth/recovery' element={<Recovery />} /> */}

                        <Route path='/home' element={<AuthRoute> <Home /> </AuthRoute>} />

                        {/* <Route path='/home/restaurant' element={<AuthRoute> <Restaurant /> </AuthRoute>} /> */}
                        
                        {/* <Route path='/home/headquarters' element={<AuthRoute> <Headquarters /> </AuthRoute>} /> */}
                        {/* <Route path='/home/headquarters/new' element={<AuthRoute> <NewHeadquarter /> </AuthRoute>} /> */}
                        {/* <Route path='/home/headquarters/edit/:id' element={<AuthRoute> <EditHeadquarter /> </AuthRoute>} /> */}
                        
                        {/* <Route path='/home/digitalmenu' element={<AuthRoute> <DigitalMenu /> </AuthRoute>} /> */}
                        
                        {/* <Route path='/home/categories' element={<AuthRoute> <Categories /> </AuthRoute>} />
                        <Route path='/home/categories/new' element={<AuthRoute> <NewCategory /> </AuthRoute>} />
                        <Route path='/home/categories/edit/:id' element={<AuthRoute> <EditCategory /> </AuthRoute>} /> */}

                        {/* <Route path='/home/subcategories' element={<AuthRoute> <Subcategories /> </AuthRoute>} />
                        <Route path='/home/subcategories/new' element={<AuthRoute> <NewSubcategory /> </AuthRoute>} />
                        <Route path='/home/subcategories/edit/:id' element={<AuthRoute> <EditSubcategory /> </AuthRoute>} /> */}

                        {/* <Route path='/home/products' element={<AuthRoute> <Products /> </AuthRoute>} />
                        <Route path='/home/products/new' element={<AuthRoute> <NewProduct /> </AuthRoute>} />
                        <Route path='/home/products/edit/:id' element={<AuthRoute> <EditProduct /> </AuthRoute>} /> */}

                        {/* <Route path='/home/profile' element={<AuthRoute> <Profile /> </AuthRoute>} />
                        <Route path='/home/profile/changepassword' element={<AuthRoute> <ChangePassword /> </AuthRoute>} /> */}

                        <Route path='*' element={<Default />} />

                    </Routes>
                </StatesProvider>   
            </AuthProvider>
        </BrowserRouter>
    );
}

export { AppUi };
