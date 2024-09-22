"use client";
import { auth } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { db } from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function Home() {
  const numbersArray = Array.from({ length: 38 }, (_, index) => index + 15);
  async function updateAllDocuments() {
    const collectionRef = collection(db, "testLeaderboard"); // Replace 'your-collection-name' with your actual collection name

    try {
      const querySnapshot = await getDocs(collectionRef);

      querySnapshot.forEach(async (docSnap) => {
        const docRef = doc(collectionRef, docSnap.id); // Use doc function here, not docSnap
        await setDoc(
          docRef,
          {
            scores: Object.fromEntries(new Map<string, any>()),
          },
          { merge: false }
        );
        console.log(`Document ${docSnap.id} updated successfully`);
      });

      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  }

  async function removeAlt() {
    const collectionRef = collection(db, "leaderboard"); // Collection reference
  
    try {
      const querySnapshot = await getDocs(collectionRef); // Get all documents in the collection
  
      querySnapshot.forEach(async (docSnap) => {
        const docRef = doc(collectionRef, docSnap.id); // Document reference
  
        // Fetch current document data
        const docData = docSnap.data();
  
        // Check if 'scores' field exists
        if (docData && docData.scores) {
          const scores = { ...docData.scores }; // Clone the existing 'scores' object
  
          const keyToRemove = "myalt@gmail.com"; // The key to be removed
  
          // Check if the key exists in the 'scores' object
          if (keyToRemove in scores) {
            delete scores[keyToRemove]; // Remove the key-value pair
          }
  
          // Update the document with the modified 'scores'
          await setDoc(docRef, { scores }, { merge: false }); // Merge ensures other fields remain intact
          console.log(`Document ${docSnap.id} updated successfully`);
        }
      });
  
      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  }
  
  async function addDocumentWithCustomId() {
    const collectionRef = collection(db, "leaderboard"); // Replace 'leaderboard' with your actual collection name
    numbersArray.forEach(async (value) => {
      const docRef = doc(collectionRef, String(value)); // Create a reference with custom ID

      try {
        await setDoc(docRef, { scores: [] });
        console.log(`Document with ID ${value} added successfully`);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    });
  }
  return (
    <>
      <div>hey</div>
      <button
       onClick={removeAlt}
        className="ml-48 bg-black text-white p-5 rounded-2xl"
      >
        CLICK
      </button>
    </>
  );
}