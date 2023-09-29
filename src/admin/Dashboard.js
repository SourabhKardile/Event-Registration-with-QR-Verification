import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function Dashboard() {
  const [userData, setUserData] = useState([]);
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "List"));
      const newData = [];
      querySnapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          name: doc.data().name,
          phone: doc.data().phone,
          address: doc.data().address,
          confirm: doc.data().confirm
        };
        newData.push(data);
      });
      setUserData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Call the asynchronous function here
  }, []); // Empty dependency array to run this effect only once

  
  //MUI

  const columns = [
    {
      field: "button",
      headerName: "edit",
      renderCell: (params) => {
        return (
          <button
            style={{
              border: "none",
              padding: "0",
              color: "blue",
              backgroundColor: "transparent",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <i
            style={{fontSize:20}}
              onClick={() => {
                console.log(params.id);
              }}
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
                color: params.value === '0' ? 'red': 'green',
                backgroundColor: "transparent",
                margin: "10px",
                cursor: "pointer",
              }}
            >
              <i style={{fontSize:20}}
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
    { field: "name", headerName: "Full Name", width: 250 },
    { field: "phone", headerName: "Phone Number", width: 170 },
    {
      field: "address",
      headerName: "Address",
      width: 500,
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
          checkboxSelection
          onPageSizeChange={() => {}}
          onSelectionModelChange={() => {}}
          
          autoHeight
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
}
