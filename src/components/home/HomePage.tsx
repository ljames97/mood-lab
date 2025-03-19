// Home.tsx

import Header from "./Header";
import MyBoards from "./MyBoards";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <MyBoards />
      </div>
      <footer className="rounded-t-3xl bg-primary-darkest text-white flex w-full justify-end items-center p-4 px-8">
      {/* <svg width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.235 9.19a1.5 1.5 0 1 1 .448-2.966 1.5 1.5 0 0 1-.448 2.966zM14.235 8.99a1.5 1.5 0 1 1 .448-2.966 1.5 1.5 0 0 1-.448 2.966zm2.317 3.2A1.5 1.5 0 1 1 17 9.224a1.5 1.5 0 0 1-.448 2.966z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.586 3v.015c4.749.06 8.63 3.52 8.63 7.854a5.202 5.202 0 0 1-5.195 5.195H14.44a.575.575 0 0 0-.435.962 2.085 2.085 0 0 1-1.542 3.478h-.005a8.755 8.755 0 0 1 0-17.5l.13-.004zM7.51 6.73a7.255 7.255 0 0 1 4.955-2.216c4.035.001 7.242 2.88 7.242 6.355a3.693 3.693 0 0 1-3.685 3.695h-1.58a2.084 2.084 0 0 0-1.554 3.458l.007.007a.576.576 0 0 1-.428.985A7.255 7.255 0 0 1 7.509 6.73z" fill="white"></path></svg> */}
        <p>© 2025 MoodLab.</p>
      </footer>
    </div>
  )
}