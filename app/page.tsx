"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "@/firebase/config";
import TextField from "@mui/material/TextField";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { ParticleBackground } from "./components/ParticleBackground";
import { MdMenuBook } from "react-icons/md";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const colRef = collection(db, "users");

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1825);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/home");
      })
      .catch(() => {
        alert("Incorrect Email or Password");
      });
  };

  const handleGoogleSignIn = async () => {
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
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <>
      <ParticleBackground />
      <main className="md:flex md:flex-row w-screen h-screen overflow-y-auto md:overflow-y-clip">
        <div className="bg-transparent flex flex-col md:h-full h-[80%] w-full xl:w-[80%] md:w-[70%] overflow-y-clip">
          <div className="font-sans md:text-6xl text-4xl font-bold h-screen w-full flex flex-col items-center justify-center text-orange-400">
            <h1>Project Sense</h1>
            <p className="w-[85%] md:text-xl text-base font-normal md:mt-2 text-center">
              Your go-to platform for mastering mental math and number sense
            </p>
          </div>
        </div>
        <div className="flex  flex-col bg-orange-300 justify-center items-center w-full xl:w-[30%] md:w-[40%] h-screen md:py-0 py-8">
          <button
            onClick={() => {
              window.open("https://project-sense.vercel.app/manual.pdf");
            }}
            className="flex flex-row gap-x-2 items-center justify-center font-bold text-4xl font-sans absolute md:text-white text-orange-400 top-5 underline hover:decoration-4"
          >
            User Guide
            <MdMenuBook className="text-5xl md:text-white text-orange-400" />
          </button>
          <div className="flex flex-col gap-y-6 items-center justify-center w-[90%] bg-white p-4 rounded-2xl">
            <h1 className="text-4xl font-sans font-bold mt-16">Login</h1>
            <form
              onSubmit={onSubmit}
              className="gap-y-6 w-full flex flex-col items-center"
            >
              <TextField
                id="email"
                className="w-[80%] font-bold text-white"
                label="Email"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Store email in state
              />
              <TextField
                id="password"
                className="w-[80%] text-white"
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Store password in state
              />
              <a
                href="/register"
                className="underline hover:decoration-2 w-[80%] text-md text-left"
              >
                Don&apos;t have an account?
              </a>
              <button
                type="submit"
                className="btn text-xl bg-orange-300 w-[80%] hover:bg-orange-400 text-white font-sans"
              >
                Login
              </button>
            </form>
            <button
              onClick={handleGoogleSignIn}
              className="mb-16 hover:scale-105 ease-in-out duration-200 hover:bg-gray-200 bg-white items-center w-[80%] mx-auto text-xl flex py-2 rounded-2xl gap-x-2 justify-center font-serif border-[1px] border-black"
            >
              <FcGoogle className="" />
              <span className="font-sans">Sign In with Google</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
