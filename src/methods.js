import { doc, setDoc, runTransaction, updateDoc, getDoc } from "@firebase/firestore";
import { auth, firestore } from "./firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const formatNumber = (number) => {
  if (number < 10) {
    return `00${number}`;
  } else if (number < 100) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
};
export const AddDocumentChild = async (data) => {
  const sfDocRef = doc(firestore, "Children", "counterId");
  let newPopulation = null;
  let exceededLimit = false;
  try {
    await runTransaction(firestore, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        // eslint-disable-next-line no-throw-literal
        throw "Document does not exist!";
      }
      newPopulation = sfDoc.data().population + 1;
      if (newPopulation > 500) {
        exceededLimit = true; // Set the flag
        newPopulation = 0; // Reset newPopulation to 0
        return;
      }
      transaction.update(sfDocRef, { population: newPopulation });
      const formattedPopulation = formatNumber(newPopulation);
      const newRef = doc(firestore, "Children", formattedPopulation);
      await setDoc(newRef, data);
    });
    console.log("Transaction successfully committed!");
    if (exceededLimit) {
      return 0;
    } else {
      return newPopulation;
    }
  } catch (e) {
    console.log("Transaction failed: ", e);
    return null;
  }
};
export const AddDocumentAdult = async (data) => {
  const sfDocRef = doc(firestore, "Adult", "counterId");
  let newPopulation = null;
  let exceededLimit = false;
  try {
    await runTransaction(firestore, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        // eslint-disable-next-line no-throw-literal
        throw "Document does not exist!";
      }
      newPopulation = sfDoc.data().population + 1;
      if (newPopulation > 500) {
        exceededLimit = true; // Set the flag
        newPopulation = 0; // Reset newPopulation to 0
        return;
      }
      transaction.update(sfDocRef, { population: newPopulation });
      const formattedPopulation = formatNumber(newPopulation);
      const newRef = doc(firestore, "Adult", formattedPopulation);
      await setDoc(newRef, data);
    });
    console.log("Transaction successfully committed!");
    if (exceededLimit) {
      return 0;
    } else {
      return newPopulation;
    }
  } catch (e) {
    console.log("Transaction failed: ", e);
    return null;
  }
};

export const EditDocument = async (data,id,ageGroup) => {
  const pass = formatNumber(id);
  const DocRef = doc(firestore, ageGroup, pass);
  try {
    const docSnap = await getDoc(DocRef);
    if (docSnap.exists()) {
      await updateDoc(DocRef, {
        surname: data.surname,
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        colony: data.colony || "",
        sector: data.sector || "",
        plot: data.plot || "",
        flat: data.flat || "",
        dob: data.dob || "",
        email: data.email || "",
        phone: data.phone || "",
        customSector: data.customSector || "",
        confirm: 1,
      });
      return id;
    } else {
      return false;
      // Handle the case where the document is not found.
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
    // Handle other errors that may occur during the update.
  }
};
export const setUpRecaptcha = (number) => {
  const recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {}
  );
  recaptchaVerifier.render();
  return signInWithPhoneNumber(auth, number, recaptchaVerifier);
};

export const ConfirmPass = async (id) => {
  const [passNo, ageGrp] = id.split(',');
  const data = formatNumber(passNo);

  let collectionName;
if (ageGrp === 'adult') {
  collectionName = 'Adult';
} else if (ageGrp === 'children') {
  collectionName = 'Children';
} else {

  return false;
}
  const DocRef = doc(firestore, collectionName, data);

  try {
    const docSnap = await getDoc(DocRef);

    if (docSnap.exists()) {
      await updateDoc(DocRef, { confirm: 1 });
      return docSnap.data();
    } else {
      return false;
      // Handle the case where the document is not found.
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
    // Handle other errors that may occur during the update.
  }
};



export const DeletePass = async (id) => {
  const [passNo, ageGrp] = id.split(',');
  const data = formatNumber(passNo);

  let collectionName;
if (ageGrp === 'adult') {
  collectionName = 'Adult';
} else if (ageGrp === 'children') {
  collectionName = 'Children';
} else {

  return false;
}
  const DocRef = doc(firestore, collectionName, data);

  try {
    const docSnap = await getDoc(DocRef);

    if (docSnap.exists()) {
      await updateDoc(DocRef, { 
        surname: "",
        firstName:"",
        middleName: "",
        colony: "",
        sector: "",
        plot: "",
        flat: "",
        dob:"",
        email:"",
        phone:"",
        customSector:"",
        confirm: 0,
        
      });
      return docSnap.data();
    } else {
      return false;
      // Handle the case where the document is not found.
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
    // Handle other errors that may occur during the update.
  }
};