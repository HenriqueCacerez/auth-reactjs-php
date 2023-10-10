import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages 
import Login        from './pages/Auth/Login';
import Register     from './pages/Auth/Register';
import Dashboard    from './pages/Dashboard';
import Error404     from './pages/Error/404';
import Logout       from './pages/Auth/Logout';

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"          element={ <Login /> } />
                <Route path="/login"     element={ <Login /> } />
                <Route path="/register"  element={ <Register /> } />
                <Route path="/dashboard" element={ <Dashboard />  } />
                <Route path="/logout"    element={ <Logout/> } />
                <Route path="/*"         element={ <Error404 /> } />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;