import {

  doc,
  setDoc,
  runTransaction,
} from "@firebase/firestore";
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
export const AddDocument = async (data) => {
  const sfDocRef = doc(firestore, "List", "counterId");
  let newPopulation = null;
  try {
    await runTransaction(firestore, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        // eslint-disable-next-line no-throw-literal
        throw "Document does not exist!";
      }
      newPopulation = sfDoc.data().population + 1;
      transaction.update(sfDocRef, { population: newPopulation });
      const formattedPopulation = formatNumber(newPopulation);
      const newRef = doc(firestore, "List", formattedPopulation);
      setDoc(newRef, data);

         });
    console.log("Transaction successfully committed!");
    return newPopulation;

  } catch (e) {
    console.log("Transaction failed: ", e);
    return null;
  }
};
export const setUpRecaptcha = (number) =>{
  const recaptchaVerifier = new RecaptchaVerifier(
    auth, 'recaptcha-container', {}
  );
  recaptchaVerifier.render();
  return signInWithPhoneNumber(auth, number, recaptchaVerifier);
}
