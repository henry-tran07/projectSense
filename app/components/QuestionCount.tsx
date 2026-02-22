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
  } catch (error) {
    console.error("Failed to update answered questions count:", error);
  }
};

const updateGeneratedQuestions = async (num: number) => {
  try {
    const docRef = doc(db, "statistics", "questions_generated");

    await updateDoc(docRef, {
      total: increment(num),
    });
  } catch (error) {
    console.error("Failed to update generated questions count:", error);
  }
};

export { updateAnsweredQuestions, updateGeneratedQuestions };
