// Navbar.tsx

import { useParams, useRouter } from "next/navigation"
import SubMenuModal from "../modal/SubMenuModal";
import { useEffect, useRef, useState } from "react";
import ExportMenu from "./ExportMenu";

export default function Navbar({ title, handleRenameTitle, handleDeleteMoodboard }) {
  const params = useParams();
  const router = useRouter();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef(null);

  const handleHomeClick = () => {
    router.push("/");
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen((prev) => !prev);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  }

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setEditing(false);
    }
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }

    if (editing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editing]);

  const handleOnChange = (event) => {
    setNewTitle(event.target.value);
  }

  const handleSave = () => {
    if (newTitle.trim() !== title) {
    }
    handleRenameTitle(newTitle);
    setEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };
   
  return (
    <div className="relative">
      {editing && (
        <div className="fixed inset-0 backdrop-blur-sm z-10"></div>
      )}

      <div className="flex p-5 px-8 justify-between items-center bg-primary-darkest">
        <svg onClick={handleHomeClick} className="hover:cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 13c0-1.657 1-3 3-3s3 1.343 3 3v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3Zm4.5 0v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-3c0-.535.16-.895.353-1.105.175-.19.502-.395 1.147-.395s.972.205 1.147.395c.193.21.353.57.353 1.105Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12.245a5 5 0 0 1 1.678-3.737l4.665-4.146a4 4 0 0 1 5.315 0l4.664 4.146A5 5 0 0 1 21 12.245V17a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4.755Zm16.5 0V17a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 17v-4.755A3.5 3.5 0 0 1 5.675 9.63l4.664-4.146a2.5 2.5 0 0 1 3.322 0l4.664 4.146a3.5 3.5 0 0 1 1.175 2.616Z" fill="white"></path></svg>
        {editing ? (
          <input
            ref={inputRef}
            className="z-100 text-white text-center tracking-widest text-sm focus:outline-none" 
            type="text"
            placeholder={title}
            value={newTitle}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
          />
        ) : ( 
        <h2 className="text-white text-sm tracking-widest">{title}</h2>
        )}
        <div>
          <svg onClick={toggleSubMenu} className="hover:cursor-pointer" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 11.75V19a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5v-7.25a.75.75 0 1 1 1.5 0V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7.25a.75.75 0 1 1 1.5 0Zm8.323-6.19v9.69a.75.75 0 0 1-1.5 0l-.001-9.69-3.037 3.215a.751.751 0 0 1-1.062-1.06l4.318-4.495a.751.751 0 0 1 1.062 0l4.18 4.495a.749.749 0 1 1-1.06 1.06l-2.9-3.216Z" fill="white" fill-rule="nonzero"></path></svg>
          <SubMenuModal isOpen={isSubMenuOpen} onClose={() => setIsSubMenuOpen(false)}>
            <ExportMenu toggleEdit={toggleEdit} toggleSubMenu={toggleSubMenu} handleDeleteMoodboard={handleDeleteMoodboard}/>
          </SubMenuModal>
        </div>
      </div>
    </div>
  )
}