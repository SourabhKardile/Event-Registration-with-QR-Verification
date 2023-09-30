import React, { useState } from "react";
import "./home.css";
import { AddDocument, setUpRecaptcha } from "./methods";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import QRCode from 'qrcode-generator';
import jsPDF from 'jspdf';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [enterOTP, setEnterOTP] = useState(false);
  const [OTPCode, setOTPCode] = useState("");
  const [confirmObj, setConfirmObj] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [addDoc, setAddDoc] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [passNo, setPassNo] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setAddDoc(true);
      if (!phoneVerified) {
        setError("Phone number not verified");
        return;
      }
      if (!address) {
        setError("Please enter Address.");
        return;
      } else {
        setError("");
      }
      const nameWords = name.split(" ");
      if (nameWords.length < 2) {
        setError("Please enter your full name.");
        return;
      } else {
        setError("");
      }

      const data = {
        name: name,
        phone: phone,
        address: address,
        confirm: 0,
      };
      const code = await AddDocument(data);
      setPassNo(code);
      handleOpen();
    } catch (err) {
      setError(err);
    } finally {
      setAddDoc(false);
    }
  };

  const SendOTP = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    try {
      const number = "+91" + phone;
      const response = await setUpRecaptcha(number);
      if (response) {
        setConfirmObj(response);
        setEnterOTP(true);
      }
    } catch (e) {
      setOtpError("Something went wrong please try again!");
    }
  };

  const verifyOTP = async () => {
    if (!confirmObj) {
      setOtpError("Invalid OTP confirmation object.");
      return;
    }

    if (!OTPCode) {
      setOtpError("Please enter OTP.");
      return;
    }
    try {
      setVerifyLoader(true);
      setOtpError("");

      const result = await confirmObj.confirm(OTPCode);
      if (result) {
        console.log(result);
        setOTPCode("");
        setPhoneVerified(true);
        setEnterOTP(false);
      }
    } catch (e) {
      console.log(e);
      setOtpError("Invalid OTP");
    } finally {
      setVerifyLoader(false);
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = async() => {await generateQR();setOpen(false); navigate(0)};
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const generateQR = async() => {
    const qr = QRCode(0, 'H');
    qr.addData(`${passNo}`);
    qr.make();
  
    const qrCodeUrl = qr.createDataURL(10, 10);
  
    const doc = new jsPDF();
    doc.addImage(qrCodeUrl, 'PNG', 10, 10, 100, 100);
    doc.save('sample.pdf');
  }
  return (
    <div className="main">
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
        <h3 align="center">Your Pass Number is: </h3>
          <h1 align="center">{passNo}</h1>
          <p>
            Name: <b>{name}</b><br />
            Phone: <b>{phone}</b><br />
            Address:<b>{address}</b><br />

          </p>
          <Button onClick={handleClose}>Download QRCode</Button>
        </Box>
      </Modal>
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
              {phoneVerified ? (
                <img
                  className="VerifyLogo"
                  src={require("../src/verify.png")}
                  alt=""
                />
              ) : (
                <button
                  type="button"
                  className="send-otp"
                  onClick={() => SendOTP()}
                >
                  Send OTP
                </button>
              )}

              {enterOTP ? (
                <>
                  <div className="input-box input-box-phone">
                    <span className="details">Enter OTP</span>
                    <input
                      type="number"
                      placeholder="Enter OTP Code"
                      required
                      onChange={(e) => setOTPCode(e.target.value)}
                    />
                  </div>
                  {verifyLoader ? (
                    <div className="spinner-container">
                      <div className="loading-spinner"></div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="send-otp"
                      onClick={verifyOTP}
                    >
                      Verify Code
                    </button>
                  )}
                </>
              ) : (
                <div id="recaptcha-container" />
              )}
              {otpError && (
                <div className="error" style={{ color: "red" }}>
                  {otpError}
                </div>
              )}

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
            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            )}
            <div className="button">
              {addDoc ? (
                <div
                  className="spinner-container"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <input type="submit" value="Register" />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
