'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";
import Image from "next/image";
import { logo } from "@/assets";
import { deleteMoodboard, renameTitle } from "../utils/moodboardUtils";

export default function MoodBoardPage() {
  const params = useParams();
  const router = useRouter();
  const [moodboard, setMoodboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = localStorage.getItem("guest") === "true";

  // Ensure `id` is a string (fixes potential array issue)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchMoodboard = async () => {
      if (!id) {
        console.error("No moodboard ID provided!");
        router.replace("/");
        return;
      }

      if (isGuest && id.startsWith("guest_")) {
        const guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
        const guestBoard = guestBoards.find(board => board.id === id);

        if (guestBoard) {
          setMoodboard(guestBoard);
        } else {
          console.error("Guest Moodboard not found in localStorage!");
          router.replace("/");
        }
        setLoading(false);
        return;
      }

      // Fetch Firebase MoodBoard for logged-in users
      try {
        console.log("Fetching Firebase moodboard...");
        const docRef = doc(db, "moodboards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMoodboard(docSnap.data());
        } else {
          console.error("Moodboard not found in Firestore!");
          router.replace("/");
        }
      } catch (error: any) {
        console.error("Error fetching moodboard:", error.message);
      }
      setLoading(false);
    };

    fetchMoodboard();
  }, [id, isGuest, router]);

  const handleRenameTitle = async (newTitle) => {
    await renameTitle(id, moodboard, newTitle, isGuest, setMoodboard)
  }

  const handleDeleteMoodboard = () => {
    deleteMoodboard(id, isGuest);
  }

  if (loading) return <p>Loading...</p>;
  if (!moodboard) return <p>Error: Moodboard not found</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar handleRenameTitle={handleRenameTitle} handleDeleteMoodboard={handleDeleteMoodboard} title={moodboard.title} />
      <div className="export-content bg-white flex-grow flex m-8 shadow-lg">
      </div>
      <Toolbar />
    </div>
  );
}
