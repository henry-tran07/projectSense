"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { MdMenuBook } from "react-icons/md";
import { AuthForm } from "./components/AuthForm";
import { PageShell } from "./components/PageShell";

const MATH_SYMBOLS = [
  "2", "7", "13", "+", "=", "42", "x", "3",
  "99", "%", "17", "24", "-", "5", "11",
  "81", "64", "27", "0", "8", "36", "100",
  "49", "16", "25",
];

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const colRef = collection(db, "users");

  const onSubmit = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch {
      setError("Incorrect Email or Password");
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

  // Deterministic particle generation — no Math.random() for hydration safety
  const particles = useMemo(() => {
    return MATH_SYMBOLS.map((symbol, i) => ({
      symbol,
      left: (i * 37 + 13) % 100,
      duration: 15 + (i % 7) * 4,
      delay: -(i * 2.3),
      fontSize: 14 + (i % 4) * 6,
      opacity: 0.06 + (i % 5) * 0.03,
    }));
  }, []);

  return (
    <PageShell>
      {/* Floating math particles */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute font-mono text-white select-none will-change-transform animate-drift"
            style={{
              left: `${p.left}%`,
              bottom: '-5%',
              fontSize: `${p.fontSize}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* User Guide button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            window.open("https://project-sense.vercel.app/manual.pdf");
          }}
          className="glass-card-elevated rounded-full hover:scale-105 transition-transform flex items-center gap-2 text-orange-700 hover:text-orange-800 font-bold text-sm px-4 py-2 animate-fade-in-up"
          style={{ animationDelay: '1.8s', animationFillMode: 'both' }}
        >
          User Guide
          <MdMenuBook className="text-xl" />
        </button>
      </div>

      {/* Main content — centered vertical stack */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Heading with dramatic glow */}
        <h1
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight text-center animate-scale-in"
          style={{
            textShadow: `
              0 0 40px rgba(251, 146, 60, 0.5),
              0 0 80px rgba(251, 146, 60, 0.3),
              0 4px 24px rgba(154, 52, 18, 0.4)
            `,
            animationDelay: '0.1s',
            animationFillMode: 'both',
            animationDuration: '0.7s',
          }}
        >
          Project Sense
        </h1>

        {/* Tagline */}
        <p
          className="mt-3 text-base sm:text-lg md:text-xl text-white/70 text-center max-w-lg leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
        >
          Your go-to platform for mastering mental math and number sense
        </p>

        {/* Robot mascot — bounce-in then continuous float */}
        <div
          className="mt-6 mb-8 animate-bounce-in"
          style={{
            animationDelay: '0.6s',
            animationFillMode: 'both',
          }}
        >
          <Image
            src="/psrobot.png"
            alt="Project Sense mascot"
            width={120}
            height={120}
            className="animate-float drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(251, 146, 60, 0.4))' }}
          />
        </div>

        {/* Auth card with animated gradient border */}
        <div
          className="relative w-full max-w-md animate-fade-in-up"
          style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
        >
          {/* Rotating conic-gradient glow behind the card */}
          <div className="absolute -inset-[3px] rounded-[20px] overflow-hidden" aria-hidden="true">
            <div
              className="absolute -inset-[50%] will-change-transform animate-border-rotate"
              style={{
                background: 'conic-gradient(from 0deg, #fb923c, #fbbf24, #fdba74, #f97316, #fb923c)',
              }}
            />
          </div>
          {/* Outer diffuse glow for depth */}
          <div
            className="absolute -inset-[8px] rounded-3xl opacity-25 blur-lg animate-pulse-glow"
            style={{
              background: 'conic-gradient(from 0deg, #fb923c, transparent, #fbbf24, transparent, #fb923c)',
            }}
            aria-hidden="true"
          />
          {/* Auth form content */}
          <div className="relative">
            <AuthForm
              mode="login"
              onSubmit={onSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              error={error}
            />
          </div>
        </div>

        {/* Footer text */}
        <p
          className="mt-8 text-xs sm:text-sm text-white/40 text-center font-mono tracking-wider animate-fade-in-up"
          style={{ animationDelay: '1.4s', animationFillMode: 'both' }}
        >
          TMSCA / UIL Number Sense Training
        </p>
      </div>
    </PageShell>
  );
}
