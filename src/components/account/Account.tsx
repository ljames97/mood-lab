
'use client';

import { useRouter } from "next/navigation";
import ProfilePhoto from "../home/ProfilePhoto";
import { logOut } from "@/config/auth";
import { useAuth } from "@/store/AuthContext";
import { deleteUser, updateProfile } from "firebase/auth";
import { auth, storage } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";

export default function Account() {
  const router = useRouter();
  const guest = localStorage.getItem('guest');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    router.back();
  }

  const handleLogout = async () => {
    await logOut();
    window.location.href = "/auth";
  }

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
  
      if (user) {
        await deleteUser(user);
        window.location.href = "/auth";
      }
    } catch (error: any) {
      console.error("Error deleting account:", error.message);
      alert("Failed to delete account. Try logging in again and retry.");
    }
  };

   const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (guest === "false") {
      // Firebase Upload
      const user = auth.currentUser;
      if (!user) return;

      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });
    } else {
      // LocalStorage Upload (Guest)
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("guestProfile", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    window.location.reload()
  };

  return (
    <>
      <div className="flex flex-col items-center text-white/90">
        <div className='flex justify-between w-screen p-12 px-8 pb-12 text-2xl'>
          <h3>Your Account</h3>
          <button onClick={handleClick}>X</button>
        </div>
        <ProfilePhoto size={120} />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      <ul className="self-start mt-12 tracking-widest">
        <li onClick={triggerFileUpload} className="border-b border-white/80 p-4 py-6 w-screen">
          UPDATE AVATAR
        </li>
        <li onClick={handleLogout} className="border-b border-white/80 p-4 py-6 w-screen">
          {guest === 'false' ? 'LOGOUT' : 'LOGOUT GUEST'}
        </li>
        {guest === 'false' && (
          <li onClick={handleDeleteAccount} className="border-b border-white/80 p-4 py-6 w-screen">
          DELETE ACCOUNT
          </li>
        )}
      </ul>
    </div>
    </>
  )
}