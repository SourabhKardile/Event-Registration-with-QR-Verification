import React from 'react'
import { useNavigate } from 'react-router';
import Button from "@mui/material/Button";

export default function Menu() {
    const navigate = useNavigate();
    const handleNavigate = (ageGrp) => {
      navigate('/dashboard', { state: { ageGrp } });
    };
  return (
    <div style={{display:'flex',flexDirection:'column', marginTop:50, alignItems:'center'}}>

    <Button onClick={()=>{navigate('/scan')}} variant="contained" color="success" style={{width:'50%', marginTop:50, height:50}}>Scanner</Button>

    <Button onClick={() => handleNavigate('child')} variant="contained" color="success" style={{width:'50%', marginTop:50, height:50}}>Dashboard Children</Button>
    <Button onClick={() => handleNavigate('adult')} variant="contained" color="success" style={{width:'50%', marginTop:50, height:50}}>Dashboard Adult</Button>
    <Button onClick={()=>{navigate('/adminreg')}} variant="contained" color="success" style={{width:'50%', marginTop:50, height:50}}>Admin Register</Button>

    </div>
  )
}
