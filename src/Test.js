import {

  doc,
  setDoc,
  runTransaction,
} from "@firebase/firestore";
import { firestore } from "./firebaseConfig";

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
      const newRef = doc(firestore, "List", newPopulation.toString());
      setDoc(newRef, data);

         });
    console.log("Transaction successfully committed!");
    return newPopulation;

  } catch (e) {
    console.log("Transaction failed: ", e);
    return null;
  }
};
