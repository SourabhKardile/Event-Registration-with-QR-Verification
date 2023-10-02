import React, { useEffect, useState } from "react";
import "./home.css";
import { AddDocumentAdult, AddDocumentChild, setUpRecaptcha } from "./methods";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import QRCode from "qrcode-generator";
import jsPDF from "jspdf";

export default function Home() {
  const navigate = useNavigate();
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [colony, setColony] = useState("");
  const [sector, setSector] = useState("1");
  const [customSector, setCustomSector] = useState("");
  const [plot, setPlot] = useState("");
  const [dob, setDob] = useState("");
  const [ageGrp, setAgeGrp] = useState("");
  const [email, setEmail] = useState("");
  const [flat, setFlat] = useState("");

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [enterOTP, setEnterOTP] = useState(false);
  const [OTPCode, setOTPCode] = useState(""); //
  const [confirmObj, setConfirmObj] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [addDoc, setAddDoc] = useState(false);
  const [open, setOpen] = useState(false);
  const [passNo, setPassNo] = useState("");
  useEffect(()=>{
    handleAgeChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dob]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSector(value);
  };
  const handleAgeChange = () => {
    const ageGroup = calculateAgeGroup(dob);
    setAgeGrp(ageGroup);
  };
  const calculateAgeGroup = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayOccurredThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

      if (age <= 14 || (age === 15 && !hasBirthdayOccurredThisYear)) {
        return 'children';
      } else if(isNaN(age)){
        return '';
      }else{
        return 'adult';
      }
    };
  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      setAddDoc(true);
      if(!surname){
        setError("Enter Surname")
      }
      if(!firstName){
        setError("Enter First Name")
      }
      if(!middleName){
        setError("Enter Middle Name")
      }

      if (!phoneVerified) {
        setError("Phone number not verified");
        return;
      }
      if(!sector){
        setError("Please enter Sector no.");
        return;
      }
      if(!plot && !flat){
        setError("Please enter Plot or Flat no.");
        return;
      }
      if(!dob){
        setError("Please enter Date of Birth");
        return;
      }
      if(!ageGrp){
        setError("Please select Age Group");
        return;
      }
      if(!customSector && sector ==='custom'){
        setError("Please enter Sector/Others");
        return;
      }
      if (!colony) {
        setError("Please enter Colony/ Society Name.");
        return;
      } else {
        setError("");
      }
      // console.log("Surname " + surname);
      // console.log("First Name " + firstName);
      // console.log("Midlde Name " + middleName);
      // console.log("colony " + colony);
      // console.log("sector " + sector);
      // console.log("plot  " + plot);
      // console.log("flat " + flat);
      // console.log("dob " + dob);
      // console.log("age " + ageGrp);
      // console.log("email " + email);
      // console.log("customSector: " + customSector);

      const data = {
        surname: surname,
        firstName: firstName,
        middleName: middleName,
        colony: colony,
        sector: sector,
        plot: plot,
        flat: flat,
        dob: dob,
        ageGroup:ageGrp,
        email: email,
        phone: phone,
        customSector: customSector,
        confirm: 0,
      };
      let code='';
      if(ageGrp==='children'){
        code = await AddDocumentChild(data);
      }else{
        code = await AddDocumentAdult(data);
      }
      
      setPassNo(code);
      handleOpen();
    } catch (err) {
      setError(err.toString());
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
      setOtpError("+Something went wrong please try again!"+ e);
    }
  };
  const handleOTPChange = (e) => {
    const inputOTP = e.target.value;
    setOTPCode(inputOTP);
    if (inputOTP.length === 6) {
      // Call the verifyotp function here
      verifyOTP(inputOTP);
    }
  };
  const verifyOTP = async (inputOTP) => {
    if (!confirmObj) {
      setOtpError("Invalid OTP confirmation object.");
      return;
    }

    if (!inputOTP) {
      setOtpError("Please enter OTP.");
      return;
    }
    try {
      setVerifyLoader(true);
      setOtpError("");

      const result = await confirmObj.confirm(inputOTP);
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
  const handleClose = async () => {
    await generateQR();
    setOpen(false);
    navigate(0);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const generateQR = async () => {
    const qr = QRCode(0, "H");
    qr.addData(`${passNo},${ageGrp}`);
    qr.make();

    const qrCodeUrl = qr.createDataURL(10, 10);

    const pdfWidth = 210;  // A4 width in mm
  const pdfHeight = 297; // A4 height in mm

  // Adjust the QR code width and height as needed
  const qrWidth = 80;
  const qrHeight = 80;

  // Horizontal centering for the QR code and text
  const qrXPos = (pdfWidth - qrWidth) / 2;

  const doc = new jsPDF();
  if(ageGrp === 'adult'){
    doc.setFillColor(228, 12, 243);
  }else{
    doc.setFillColor(243, 97, 29);
  }
  
  doc.rect(0, 0, pdfWidth, pdfHeight, 'F');
  // Set font size for the text to 12
  doc.setFontSize(18);

  // Add the text at the top (horizontally centered)
  const textTop = "Show this QR code to get the Pass";
  const textTopWidth = doc.getStringUnitWidth(textTop) * doc.internal.getFontSize();
  const textTopXPos = (pdfWidth - textTopWidth) +120;
  doc.text(textTop, textTopXPos, 10);

  // Set font size for the QR code text to 12 (you can adjust this as needed)
  doc.setFontSize(16);

  // Add the QR code horizontally centered
  doc.addImage(qrCodeUrl, "PNG", qrXPos, 40, qrWidth, qrHeight);

  // Add the text below the QR code
  const textBelowQR = [
    `Pass Number: ${passNo} 302`,
    `Name: ${firstName} ${middleName} ${surname} Abhishek Vilas Madigire`,
    `Phone: ${phone} 9878678987`,
    `Age Group: ${ageGrp} Adult`
  ];
  const textBelowQRYPos = 40 + qrHeight + 20; // Adjust vertical position as needed
  doc.text(textBelowQR, 10, textBelowQRYPos);
    doc.save(`shrisaichowkmitramandal${passNo}.pdf`);
  };
  return (
    <div className="main">
    <div><button onClick={()=>{generateQR()}}>Hello</button></div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h3 align="center">Your Pass Number is: </h3>
          <h1 align="center">{passNo}</h1>
          <p>
            Full Name: <b>{firstName} {middleName} {surname}</b>
            <br />
            Phone: <b>{phone}</b>
            <br />
            <br />
          </p>
          <div style={{textAlign:'center'}}> <Button onClick={handleClose} variant="contained">Download QRCode</Button></div>
         
        </Box>
      </Modal>
      <div className="container">
        <div className="title">Registration</div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box name">
                <span className="details">Surname</span>
                <input
                  type="text"
                  placeholder="Enter Surname"
                  required
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <div className="input-box name">
                <span className="details">Husband/Father Name</span>
                <input
                  type="text"
                  placeholder="Enter Middle Name"
                  required
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="input-box name">
                <span className="details">First Name</span>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-box address">
                <span className="details">Address:</span>
                <span className="details" style={{ fontSize: 14 }}>
                  Colony/Society name
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter Colony/Society name"
                  onChange={(e) => setColony(e.target.value)}
                />
              </div>
              <div className="input-box address">
                <span className="Noneed details" style={{ color: "#ffffff" }}>
                  &
                </span>
                <span className="details" style={{ fontSize: 14 }}>
                  Sector No. / Others
                </span>
                {sector === "custom" ? (
                  <input
                    type="text"
                    placeholder="Others"
                    onChange={(e) => setCustomSector(e.target.value)}
                  />
                ) : (
                  <div className="custom-dropdown">
                    <select value={sector} onChange={handleSelectChange}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="custom">Others</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="input-box optional">
                
                <span className="details" style={{ fontSize: 14 }}>
                  Plot No.<small style={{fontWeight:'normal'}}> (if applicable)</small>
                </span>
                <input
                  type="text"
                  placeholder="Enter Plot No."
                  onChange={(e) => setPlot(e.target.value)}
                />
              </div>
              <div style={{marginTop:30, fontWeight:'normal'}} > 
                <span className="details">
                  OR
                </span></div>
              <div className="input-box optional">
                
                <span className="details" style={{ fontSize: 14 }}>
                  Flat & Wing<small style={{fontWeight:'normal'}}> (if applicable)</small>
                </span>
                <input
                  type="text"
                  placeholder="Enter Flat & Wing"
                  onChange={(e) => setFlat(e.target.value)}
                />
              </div>
              <div className="input-box date">
                <span className="details">DOB</span>
                <input
                  type="date"
                  required
                  onChange={(e) => {
                    setDob(e.target.value);
                    }
                  }
                />
              </div>
              <div className="input-box age">
          <input type="radio" name="age" id="children"  onChange={handleAgeChange}  checked={ageGrp === 'children'} />
          <input type="radio" name="age" id="adult" onChange={handleAgeChange} checked={ageGrp === 'adult'} />
          <span className="details" style={{fontWeight:'500'}}>Age Group</span>
          <div className="category">
            <label htmlFor="children">
            <span className="dot one"></span>
            <span className="gender">1-14</span>
          </label>
          <label htmlFor="adult">
            <span className="dot two"></span>
            <span className="gender">15 and Above</span>
          </label>
         
          </div>
        </div>
        <div className="input-box">
                <span className="details">Email Address <small style={{fontWeight:'normal'}}> (optional)</small></span>
                <input
                  type="email"
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
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
                      maxLength={6}
                      value={OTPCode}
                      onChange={handleOTPChange}
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
                      onClick={() => verifyOTP(OTPCode)}
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
            </div>

            
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
