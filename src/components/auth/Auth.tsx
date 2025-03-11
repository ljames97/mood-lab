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
      setError(err.message);
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to home after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem('guest', 'true');
    router.push("/");
  };

  return (
    <div className="bg-primary-darkest h-screen flex flex-col justify-center items-center">
      <Logo />
      <form className="flex flex-col items-center text-white gap-5 w-2/3 mt-8">
        {error && <p className="text-red-500">{error}</p>}
        <label className="hidden" htmlFor="email">Email</label>
        <input 
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="hidden" htmlFor="password">Password</label>
        <input 
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-4 mt-4">
          <button type="button" onClick={handleSignUp} className="border border-white/80 rounded-3xl p-3 px-6">Signup</button>
          <button type="button" onClick={handleLogin} className="border border-white/80 rounded-3xl p-3 px-6">Login</button>
        </div>
        <button type="button" onClick={handleGuestLogin} className="text-sm text-white/80 tracking-widest">Login as guest</button>
      </form>
      <p className="text-white/80 pb-6 fixed bottom-0">© 2025 MoodLab.</p>
    </div>
  )
}