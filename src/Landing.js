import React from 'react'
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router';
import './landing.css';
export default function Landing() {
    const navigate = useNavigate();
  return (
    <>
    <div className="navbar">
  <Button variant="contained" onClick={()=>{navigate('/register')}} style={{width:200}}><i className="fa-solid fa-pen"></i> Registration</Button>
</div>
    <div className='backimage'>
    </div>
    </>
  )
}
