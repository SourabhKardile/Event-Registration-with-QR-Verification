import React, { useState } from "react";
import "./home.css";
import { AddDocument, setUpRecaptcha } from "./methods";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [enterOTP, setEnterOTP] = useState(false);
  const [OTPCode, setOTPCode] = useState("");
  const [confirmObj, setConfirmObj] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [addDoc, setAddDoc] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

    setAddDoc(true)
    if(!phoneVerified){
      setError("Phone number not verified");
      return;
    }
    if ( !address) {
      setError('Please enter Address.');
      return;
    }else{
      setError('')
    }
    const nameWords = name.split(' ');
    if (nameWords.length < 2) {
      setError('Please enter your full name.');
      return;
    }else{
      setError('')
    }

    const data = {
      name: name,
      phone: phone,
      address: address,
      confirm: 0,
    };
    const code = await AddDocument(data);
    alert(code);
    navigate(0)

  }catch(err){
    setError(err);
  }finally{
    setAddDoc(false)
  }
  };


  const SendOTP = async()=>{
    setError('');
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    try{
      const number = '+91' + phone;
      const response = await setUpRecaptcha(number);
      if(response){
        setConfirmObj(response);
        setEnterOTP(true);
      }
    }catch(e){
      setOtpError("Something went wrong please try again!");
    }
   
  }

  const verifyOTP = async()=>{
    if (!confirmObj) {
      setOtpError('Invalid OTP confirmation object.');
      return;
    }

    if (!OTPCode) {
      setOtpError('Please enter OTP.');
      return;
    }
    try{
      setVerifyLoader(true);
      setOtpError("");

     const result = await confirmObj.confirm(OTPCode);
     if(result){
      console.log(result);
      setOTPCode('');
      setPhoneVerified(true);
      setEnterOTP(false)
     }
     

    }catch(e){
      setOtpError("Invalid OTP");
    }finally{
      setVerifyLoader(false);
    }
  }


  return (
    <div className="main">
      <div className="container">
        <div className="title">Registration</div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-box input-box-phone">
                <span className="details">Phone Number</span>
                <input
                  type="number"
                  placeholder="Enter your number"
                  required
                  onChange={(e) => setPhone(e.target.value)}
                />
                
              </div>
              {phoneVerified ? (<img className="VerifyLogo" src={require('../src/verify.png')} alt="" />)
              :(<button type="button" className="send-otp" onClick={()=>SendOTP()}>Send OTP</button>)}
              

              {enterOTP ? (<>
                <div className="input-box input-box-phone">
                <span className="details">Enter OTP</span>
                <input
                  type="number"
                  placeholder="Enter Verification Code"
                  required
                  onChange={(e) => setOTPCode(e.target.value)}
                />
                
              </div>
              {verifyLoader ? (<div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div>) : <button type="button" className="send-otp" onClick={verifyOTP}>Verify Code</button>}
              </>
              ): 
              (<div id="recaptcha-container" />)
              }
              {otpError && <div className="error" style={{color:"red"}}>{otpError}</div>}

              
              <div className="input-box address">
                <span className="details">Address</span>
                <input
                  type="text"
                  placeholder="Enter your Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            {/* <div className="gender-details">
          <input type="radio" name="gender" id="dot-1"/>
          <input type="radio" name="gender" id="dot-2"/>
          <input type="radio" name="gender" id="dot-3"/>
          <span className="gender-title">Gender</span>
          <div className="category">
            <label for="dot-1">
            <span className="dot one"></span>
            <span className="gender">Male</span>
          </label>
          <label for="dot-2">
            <span className="dot two"></span>
            <span className="gender">Female</span>
          </label>
         
          </div>
        </div> */}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <div className="button">
              {addDoc ? (<div className="spinner-container" style={{display:'flex', justifyContent:'center'}}>
      <div className="loading-spinner">
      </div>
    </div>): <input type="submit" value="Register" />}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
