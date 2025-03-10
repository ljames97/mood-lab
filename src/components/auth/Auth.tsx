// Auth.tsx

import Logo from "../home/Logo";

export default function Auth() {
  return (
    <div className="bg-primary-darkest h-screen flex flex-col justify-center items-center">
      <Logo />
      <form className="flex flex-col items-center text-white gap-5 w-2/3 mt-10">
        <label className="hidden" htmlFor="email">Email</label>
        <input 
          type="email"
          id="email"
          placeholder="Email"
        />
        <label className="hidden" htmlFor="password">Password</label>
        <input 
          type="password"
          id="password"
          placeholder="Password"
        />
        <div className="flex gap-4 mt-4">
          <button className="border border-white/80 rounded-3xl p-3 px-6">Signup</button>
          <button className="border border-white/80 rounded-3xl p-3 px-6">Login</button>
        </div>
      </form>
      <p className="text-white/80 pb-6 fixed bottom-0">© 2025 MoodLab.</p>
    </div>
  )
}