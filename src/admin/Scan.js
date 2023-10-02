import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { ConfirmPass } from "../methods";

export default function Scan() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [scanResult, setScanResult] = useState("");
  const [success, setSuccess] = useState(false);
  const [passNo, setPassNo] = useState('');
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });
    scanner.render(success, error);
    function success(result) {
     
      setScanResult(result);
       scanner.clear();
    }
    function error(err) {
      //   console.log(err);
    }
  }, []);
  useEffect(() => {
    if (scanResult) {
      handleOpen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult]);
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
  const handleOpen = async () => {
   const data = await ConfirmPass(scanResult);
   const [number] = scanResult.split(',');
   console.log(data);
   setPassNo(number);
   setSuccess(data);
    setOpen(true);
  };
  const handleClose = () => {
    navigate(0);
    setOpen(false);
  };
  const bgColor = () => {
    if (success.ageGroup === 'adult') {
      return 'purple';
    } else if (success.ageGroup === 'children') {
      return 'orange';
    } else {
      return '#ffffff';
    }
  };
  return (
    <>
    <div style={{display:'flex', justifyContent:'center', marginTop:10}}><Button onClick={()=>{navigate('/menu')}} variant="contained" color="success" style={{margin:20}}>Back</Button></div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300, backgroundColor: bgColor() }}>
          {success ? 
          <><h3 align="center"> Pass Number</h3>
          <h1 align="center">{passNo}</h1>
          <h4 style={{fontWeight:'normal'}}>Name: <span style={{textTransform:'capitalize', fontWeight:'bold'}}>{success.firstName} {success.middleName} {success.surname}</span></h4>
         
          <h4 style={{fontWeight:'normal'}}>Age Group: <span style={{textTransform:'capitalize', fontWeight:'bold'}}>{success.ageGroup}</span></h4>
          </>: <><h1>Invalid QR </h1><h3>No Data Found</h3></>}
          <div style={{ display: "flex", justifyContent: "center", marginTop:20 }}>
            <Button onClick={handleClose} variant="contained">Done</Button>
          </div>
        </Box>
      </Modal>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <div id="reader" style={{ width: 500, height: 500 }}></div>
      </div>
    </>
  );
}
