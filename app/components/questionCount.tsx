import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase/config"; // import your Firestore db instance

const updateAnsweredQuestions = async () => {
  try {
    // Reference the document in the collection
    const docRef = doc(db, "statistics", "questions_answered");

    // Update the 'questions_answered' field by incrementing it by 1
    await updateDoc(docRef, {
      total: increment(1), // Assumes the field you're incrementing is 'count'
    });

    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const updateGeneratedQuestions = async () => {
    try {
      // Reference the document in the collection
      const docRef = doc(db, "statistics", "questions_generated");

      // Update the 'questions_answered' field by incrementing it by 1
      await updateDoc(docRef, {
        total: increment(1), // Assumes the field you're incrementing is 'count'
      });

      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  export { updateAnsweredQuestions, updateGeneratedQuestions };
