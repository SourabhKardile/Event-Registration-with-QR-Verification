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
   setSuccess(data);
    setOpen(true);
  };
  const handleClose = () => {
    navigate(0);
    setOpen(false);
  };
  return (
    <>
    <div style={{display:'flex', justifyContent:'center', marginTop:10}}><button onClick={()=>{navigate('/menu')}}>Menu</button></div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          {success ? <><h3 align="center"> Pass Number</h3>
          <h1 align="center">{scanResult}</h1></>: <><h1>Invalid QR </h1><h3>No Data Found</h3></>}
          {/* <p>
        Name: <b>{name}</b><br />
        Phone: <b>{phone}</b><br />
        Address:<b>{address}</b><br />

      </p> */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleClose}>Done</Button>
          </div>
        </Box>
      </Modal>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <div id="reader" style={{ width: 500, height: 500 }}></div>
      </div>
    </>
  );
}
