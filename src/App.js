import './App.css';
import Home from './Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './admin/Main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Main />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
