
import { Navigate, Outlet, useLocation } from "react-router-dom";


const useAuth = () =>{

  const bool = sessionStorage.getItem('user');
  const user = bool?.toLowerCase() === 'true';
    return user;
}

export default function ProtectedRoutes() {
  const location = useLocation();
    const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate replace state={{ from: location }} to="/admin" />
}
