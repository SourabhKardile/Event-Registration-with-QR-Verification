import React, { useState } from 'react'
import './home.css';
import { AddDocument } from './Test';
export default function Home() {

    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log(name);
        console.log(phone);
        console.log(address);
        const data = {
            name: name,
            phone: phone,
            address: address
        }
       const code = await AddDocument(data)
        alert(code)
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
            <input type="text" placeholder="Enter your name" required  onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="input-box">
            <span className="details">Phone Number</span>
            <input type="text" placeholder="Enter your number" required  onChange={(e) => setPhone(e.target.value)}/>
          </div>
          <div className="input-box address">
            <span className="details">Address</span>
            <input type="text" placeholder="Enter your Address" required  onChange={(e) => setAddress(e.target.value)}/>
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
        <div className="button">
          <input type="submit" value="Register"/>
        </div>
      </form>
    </div>
  </div>
  </div>
  )
}
