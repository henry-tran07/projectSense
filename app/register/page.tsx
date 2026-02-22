"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { MdMenuBook } from "react-icons/md";
import { AuthForm } from "../components/AuthForm";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const colRef = collection(db, "users");

  const onSubmit = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      if (user) {
        const userEmail = user.email;
        if (userEmail) {
          const docRef = doc(colRef, userEmail);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              questionLimited: true,
              rightLeft: false,
              autoEnter: true,
            });
          }
          router.push("/home");
        } else {
          console.error("Email is null or undefined");
        }
      } else {
        console.error("User is null or undefined");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setError(
        "An error occurred during sign-up. Please try again. Account with this email may already exist."
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const email = user.email;
        if (email) {
          const docRef = doc(colRef, email);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              questionLimited: true,
              rightLeft: false,
              autoEnter: true,
            });
          }
          router.push("/home");
        } else {
          console.error("Email is null or undefined");
        }
      } else {
        console.error("User is null or undefined");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100">
      {/* User Guide link */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            window.open("https://project-sense.vercel.app/manual.pdf");
          }}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold text-lg font-sans underline underline-offset-4 hover:decoration-2 transition-colors"
        >
          User Guide
          <MdMenuBook className="text-2xl" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left side: Hero */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-12 md:py-0">
          <h1 className="font-sans text-5xl md:text-6xl font-bold text-orange-400">
            Project Sense
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-600 text-center max-w-md">
            Your go-to platform for mastering mental math and number sense
          </p>
        </div>

        {/* Right side: Auth form */}
        <div className="flex items-center justify-center w-full md:w-1/2 px-6 pb-12 md:py-0">
          <AuthForm
            mode="register"
            onSubmit={onSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
