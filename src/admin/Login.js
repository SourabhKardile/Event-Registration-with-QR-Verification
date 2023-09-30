import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../home.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
export default function Login() {
  useEffect(()=>{
    const test = sessionStorage.getItem('user');
    if(test?.toLowerCase() === 'true'){
      navigate("/menu", {replace: true});
    }
  })
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
useEffect(()=>{
  setError('');
},[email,password])
  const handleLogin = async(event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setIsLoading(true); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log('Login success:', userCredential.user);
      if(userCredential){
        sessionStorage.setItem('user', true);
           if (location.state?.from) {
              navigate(location.state.from, {replace: true});
            }
            navigate("/menu", {replace: true});
      }
      
    } catch (error) {
      setError('Login failed. Please check your email and password.');
      // console.error('Login error:', error);
    }finally {
      setIsLoading(false);  // Set loading to false after login attempt
    }

  }

  

  return (
    
    <div className="main">
    <div className="container">
    <div className="title">Login</div>
    <div className="content">
      <form onSubmit={handleLogin}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">Email</span>
            <input type="text" placeholder="Enter email" required  onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="input-box">
            <span className="details">Password</span>
            <input type="password" placeholder="Enter your Password" required onChange={(e) => setPassword(e.target.value)} />
          </div>

        </div>
        {isLoading ? (<div className="spinner-container" style={{display:'flex', justifyContent:'center'}}>
      <div className="loading-spinner">
      </div>
    </div>) : ( <div className="button">
          <input type="submit" value="Login"/>
        </div>
        )}
        {error && <div className="error" style={{color:"red"}}>{error}</div>}
      </form>
    </div>
  </div>
  </div>
  )
}
