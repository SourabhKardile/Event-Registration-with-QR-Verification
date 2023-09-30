import React from 'react'
import { useNavigate } from 'react-router';

export default function Menu() {
    const navigate = useNavigate();
  return (
    <div>
      <button onClick={()=>{navigate('/scan')}}> Scanner</button>
     <button onClick={()=>{navigate('/dashboard')}}>Dashboard</button>
    </div>
  )
}
