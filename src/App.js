import './App.css';
import Home from './Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './admin/Dashboard';
import ProtectedRoutes from './admin/ProtectedRoutes';
import Login from './admin/Login';
import Menu from './admin/Menu';
import Scan from './admin/Scan';
import Landing from './Landing';

function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Home />} />
        <Route  path="/admin" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/scan" element={<Scan />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
       
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
