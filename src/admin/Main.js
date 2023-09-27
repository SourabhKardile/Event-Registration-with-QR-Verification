import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

export default function Main() {
    const [userData, setUserData] = useState([]);
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'List'));
      const newData = [];
      querySnapshot.forEach((doc) => {
        const data = {
            id : doc.id,
            name: doc.data().name,
            phone: doc.data().phone,
            address: doc.data().address
        }
        newData.push(data);
      });
      setUserData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Call the asynchronous function here
  }, []); // Empty dependency array to run this effect only once
console.log(userData)
  return <div></div>;
}
