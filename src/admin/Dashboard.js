import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ConfirmPass } from "../methods";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ageGrp = location.state && location.state.ageGrp;
  const [userData, setUserData] = useState([]);
  const [pass, setPass] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');

  const fetchData = async () => {
    try {
      let collectionName = ageGrp === 'child' ? 'Children' : 'Adult';
      const querySnapshot = await getDocs(collection(firestore, collectionName));

      const newData = querySnapshot.docs.map((doc) => ({
        id: parseInt(doc.id),
        ...doc.data(),
      }));

      setUserData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageGrp]);

  //MUI

  const columns = [
    {
      field: "button",
      headerName: "edit",
      renderCell: (params) => {
        return (
          <button
          onClick={() => {
                alert(params.id);
              }}
            style={{
              borderRadius:5,
              border: "none",
              padding: 5,
              paddingLeft:20,
              paddingRight:20,
              color: "#ffffff",
              backgroundColor: "#0275d8",
              margin: "5px",
              cursor: "pointer",
            }}
          >
            <i
            style={{fontSize:17}}
              
              className="trashIcon fa-sharp fa-solid fa-edit"
            ></i>
          </button>
        );
      },
    },
    {
        field: "confirm",
        headerName: "Confirm",
        renderCell: (params) => {
          return (
            <button
              style={{
                border: "none",
                padding: "0",
                color: params.value === 1 ? 'green': 'red',
                backgroundColor: "transparent",
                margin: "10px",
                cursor: "pointer",
              }}
            >
              <i style={{fontSize:25}}
                onClick={() => {
                  setAge(params.row.ageGroup)
                  setPass(params.id);
                  const name = `${params.row.firstName} ${params.row.middleName} ${params.row.surname}`
                 setName(name)
                  handleOpen();
                  
                }}
                className="trashIcon fa-sharp fa-solid fa-square-check"
              ></i>
            </button>
          );
        },
      },
    { field: "id", headerName: "Pass", width: 130 },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "middleName", headerName: "Middle Name", width: 130 },
    { field: "surname", headerName: "Last Name", width: 130 },
    { field: "phone", headerName: "Phone Number", width: 130 },
    { field: "dob", headerName: "Date of Birth", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "colony", headerName: "Colony/Society", width: 130 },
    { field: "sector", headerName: "Sector no.", width: 130 },
    { field: "plot", headerName: "Plot No.", width: 130 },
    { field: "flat", headerName: "Flat No.", width: 130 },


  ];
  const rows = userData;
  const handleOpen = async (data) => {
    setOpen(true);
  };
  const handleClose =() => {
    
    setOpen(false);
  };
  const handleConfirm = async() =>{
    const data = `${pass},${age}`
    const res = await ConfirmPass(data)
    console.log(res);
    setOpen(false);
  }

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
    <div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
      <Box sx={{ ...style, width: 300 }}> 
          <h3 align="center"> Pass Number:</h3>
          <h1 align="center">{pass}</h1>
          <h4 style={{fontWeight:'normal'}}>Name: <span style={{textTransform:'capitalize', fontWeight:'bold'}}>{name}</span></h4>
          <h4 style={{fontWeight:'normal'}}>Age Group: <span style={{textTransform:'capitalize', fontWeight:'bold'}}>{age}</span></h4>
          <div style={{ display: "flex", justifyContent: "center", marginTop:20 }}>
          <Button onClick={handleConfirm} variant="contained">Confirm</Button>
          </div>
        </Box>
      </Modal>
    <div><Button onClick={()=>{navigate('/menu')}} variant="contained" color="success" style={{margin:20}}>Back</Button>
</div>
    <div style={{ marginTop: 70 }}>
    
      <div style={{ width: "90%", margin: "0 auto ", overflow: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSize={10}
          
          
          
          autoHeight
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
    </div>
  );
}
