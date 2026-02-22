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
    <main className="page-gradient w-full">
      {/* Floating decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-16 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-orange-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* User Guide link */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            window.open("https://project-sense.vercel.app/manual.pdf");
          }}
          className="glass-pill flex items-center gap-2 text-orange-700 hover:text-orange-800 font-bold text-sm transition-colors"
        >
          User Guide
          <MdMenuBook className="text-xl" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen relative z-[1]">
        {/* Left side: Hero */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-12 md:py-0">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight" style={{ textShadow: '0 4px 24px rgba(154, 52, 18, 0.3)' }}>
              Project Sense
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70 text-center max-w-md leading-relaxed">
              Your go-to platform for mastering mental math and number sense
            </p>
          </div>
        </div>

        {/* Right side: Auth form */}
        <div className="flex items-center justify-center w-full md:w-1/2 px-6 pb-12 md:py-0">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <AuthForm
              mode="register"
              onSubmit={onSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              error={error}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
