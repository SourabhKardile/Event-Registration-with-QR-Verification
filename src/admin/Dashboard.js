import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const ageGrp = location.state && location.state.ageGrp;
  const [userData, setUserData] = useState([]);

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
                  console.log(params.value);
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
    {
      field: 'combinedField',
      headerName: 'Address',
      width: 300,
      renderCell: (params) => {
        const { sector, colony, plot, flat } = params.row;
        return `${sector} ${colony} ${plot} ${flat}`;
      },
    },
  ];
  const rows = userData;

  return (
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
  );
}
