import React, { useState, useEffect } from "react";
import { AddDocumentAdult, AddDocumentChild, EditDocument } from "../methods";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useLocation } from 'react-router-dom';

export default function AdminRegister() {
  const location = useLocation();
  const rowData = location.state ? location.state.data : null;
  
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
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [addDoc, setAddDoc] = useState(false);
  const [passNo, setPassNo] = useState("");
  const [error, setError] = useState("")
  const [editPass, setEditPass] = useState("")
  useEffect(() => {
  if(rowData){
    setEditPass(rowData.id);
    setSurname(rowData.surname);
    setFirstName(rowData.firstName);
    setMiddleName(rowData.middleName);
    setColony(rowData.colony);
    setSector(rowData.sector);
    setCustomSector(rowData.customSector);
    setPlot(rowData.plot);
    setDob(rowData.dob);
    setAgeGrp(rowData.ageGroup);
    setEmail(rowData.email);
    setPhone(rowData.phone);
    setEdit(true);
    
  }
}, [rowData]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSector(value);
  };
  const handleAgeChange = (event) => {
    setAgeGrp(event.target.id);

  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        if(!surname){
            setError("Enter Surname")
            return;
          }
          if(!firstName){
            setError("Enter First Name")
            return;
          }
          if(!middleName){
            setError("Enter Middle Name")
          }
        if(!ageGrp){
            setError("Select Age Group");
            return;
        }
      const data = {
        surname: surname,
        firstName: firstName,
        middleName: middleName,
        colony: colony,
        sector: sector,
        plot: plot,
        flat: flat,
        dob: dob,
        ageGroup: ageGrp,
        email: email,
        phone: phone,
        customSector: customSector,
        confirm: 1,
      };

      let code = "";
if (edit) {
  code = await (ageGrp === "adult" ? EditDocument(data, editPass, "Adult") : EditDocument(data, editPass, "Children"));
} else {
  // Adding
  code = await (ageGrp === "children" ? AddDocumentChild(data) : AddDocumentAdult(data));
}
      setPassNo(code);
      handleOpen();

      setAddDoc(true);
    } catch (e) {
      console.log(e);
    } finally {
      setAddDoc(false);
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = async () => {
    setOpen(false);
    if(edit){
      navigate('/menu')
    }else{
      navigate(0);
    }
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
  return (
    <><div><Button onClick={()=>{navigate('/menu')}} variant="contained" color="success" style={{margin:20}}>Back</Button>
    </div>
    <div className="main">
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
            Full Name:{" "}
            <b>
              {firstName} {middleName} {surname}
            </b>
            <br />
            Phone: <b>{phone}</b>
            <br />
            Age Group: <b>{ageGrp}</b>
            <br />
            <br />
          </p>
          <div style={{ textAlign: "center" }}>
            {" "}
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </div>
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
                value={surname}
                  type="text"
                  placeholder="Enter Surname"
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <div className="input-box name">
                <span className="details">First Name</span>
                <input
                value={firstName}
                  type="text"
                  placeholder="Enter First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-box name">
                <span className="details">Father/Husband Name</span>
                <input
                value={middleName}
                  type="text"
                  placeholder="Enter Middle Name"
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="input-box address">
                <span className="details">Address:</span>
                <span className="details" style={{ fontSize: 14 }}>
                  Colony/Society name
                </span>
                <input
                value={colony}
                  type="text"
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
                  value={sector}
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
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="13">13</option>
                      <option value="custom">Others</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="input-box optional">
                <span className="details" style={{ fontSize: 14 }}>
                  Plot No.
                  <small style={{ fontWeight: "normal" }}>
                    {" "}
                    (if applicable)
                  </small>
                </span>
                <input
                value={plot}
                  type="text"
                  placeholder="Enter Plot No."
                  onChange={(e) => setPlot(e.target.value)}
                />
              </div>
              <div style={{ marginTop: 30, fontWeight: "normal" }}>
                <span className="details">OR</span>
              </div>
              <div className="input-box optional">
                <span className="details" style={{ fontSize: 14 }}>
                  Flat & Wing
                  <small style={{ fontWeight: "normal" }}>
                    {" "}
                    (if applicable)
                  </small>
                </span>
                <input
                  type="text"
                  value={flat}
                  placeholder="Enter Flat & Wing"
                  onChange={(e) => setFlat(e.target.value)}
                />
              </div>
              <div className="input-box input-box-phone">
                <span className="details">Phone Number</span>
                <input
                  type="number"
                  value={phone}
                  placeholder="Enter your number"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="input-box">
                <span className="details">
                  Email Address{" "}
                  <small style={{ fontWeight: "normal" }}> (optional)</small>
                </span>
                <input
                  type="email"
                  
                  value={email}
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-box date">
                <span className="details">DOB</span>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </div>
              <div className="input-box age">
                <input
                  type="radio"
                  name="age"
                  disabled={edit}
                  id="children"
                  onChange={handleAgeChange}
                  checked={ageGrp === "children"}
                />
                <input
                  type="radio"
                  name="age"
                  id="adult"
                  disabled={edit}
                  onChange={handleAgeChange}
                  checked={ageGrp === "adult"}
                />
                <span className="details" style={{ fontWeight: "500" }}>
                  Age Group
                </span>
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
                <input type="submit"  value={edit ? "Edit" : "Register"} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
