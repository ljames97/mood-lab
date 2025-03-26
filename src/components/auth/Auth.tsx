// Auth.tsx

"use client";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Logo from "../home/Logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/config/firebaseConfig";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); 
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to home after login
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleGuestLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem('guest', 'true');
    }
    router.push("/");
  };

  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: { [key: string]: string } = {
      "auth/invalid-email": "Invalid email address.",
      "auth/invalid-credential": "Incorrect password.",
      "auth/user-disabled": "User account is disabled.",
      "auth/user-not-found": "No user found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/email-already-in-use": "Email is already in use.",
      "auth/weak-password": "Password is too weak.",
      "auth/missing-password": "Please enter a password.",
      "auth/missing-email": "Please enter an email address.",
    };
  
    return errorMessages[errorCode] || "An unknown error occurred. Please try again.";
  };

  return (
    <div className="bg-primary-darkest h-screen flex flex-col justify-center items-center">
      <Logo />
      <form className="flex flex-col items-center text-white gap-5 w-2/3 mt-8 md:w-1/5 md:mt-10">
        {error && <p className="text-red-500">{error}</p>}
        <label className="hidden" htmlFor="email">Email</label>
        <input 
          className="hover:bg-white/20 border border-white rounded-3xl py-4 px-8 pl-6 w-full"
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="hidden" htmlFor="password">Password</label>
        <input 
          className="hover:bg-white/20 border border-white rounded-3xl py-4 px-8 pl-6 w-full"
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-4 mt-4">
          <button type="button" onClick={handleSignUp} className="hover:bg-white/20 hover:cursor-pointer border border-white/80 rounded-3xl p-3 px-6">Signup</button>
          <button type="button" onClick={handleLogin} className="hover:bg-white/20 hover:cursor-pointer border border-white/80 rounded-3xl p-3 px-6">Login</button>
        </div>
        <button type="button" onClick={handleGuestLogin} className="hover:cursor-pointer text-sm text-white/80 tracking-widest">Login as guest</button>
      </form>
      <p className="text-white/80 pb-6 fixed bottom-0">© 2025 MoodLab.</p>
    </div>
  )
}