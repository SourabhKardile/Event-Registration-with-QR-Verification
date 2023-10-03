import React from 'react'
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router';
import './landing.css';
export default function Landing() {
    const navigate = useNavigate();
  return (
    <>
    <div class="navbar">
  <Button variant="contained" onClick={()=>{navigate('/register')}} ><i class="fa-solid fa-pen"></i> Registration</Button>
</div>
    <div className='backimage'>
    </div>
    </>
  )
}
