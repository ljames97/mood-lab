// MoodBoard.tsx

import Navbar from "./Navbar";
import Toolbar from "./Toolbar";

export default function MoodBoard () {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="bg-white flex-grow flex m-8 shadow-lg">
      </div>
      <Toolbar />
    </div>
  )
}