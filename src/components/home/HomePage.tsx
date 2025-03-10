// Home.tsx

import Header from "./Header";
import MyBoards from "./MyBoards";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <MyBoards />
      </div>
      <footer className="bg-primary-darkest text-white flex w-full justify-end p-5 px-8">
        <p>© 2025 MoodLab.</p>
      </footer>
    </div>
  )
}