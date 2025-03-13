'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";
import Image from "next/image";
import { logo } from "@/assets";

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

  const renameTitle = async (newTitle) => {
    if (!moodboard) return;

    if (isGuest) {
      const guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
      const updatedBoards = guestBoards.map(board =>
        board.id === id ? { ...board, title: newTitle } : board
      );

      localStorage.setItem("guest_moodboards", JSON.stringify(updatedBoards));
      setMoodboard(prev => ({ ...prev, title: newTitle }));
    } else {
      try {
        const docRef = doc(db, "moodboards", id);
        await updateDoc(docRef, { title: newTitle });
        setMoodboard(prev => ({ ...prev, title: newTitle }));
      } catch (error) {
        console.error("Error updating title:", error.message);
      }
    }
  };

  const deleteMoodboard = async () => {
    if (!id) return;

    if (isGuest) {
      let guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
      guestBoards = guestBoards.filter(board => board.id !== id);
      localStorage.setItem("guest_moodboards", JSON.stringify(guestBoards));
      router.replace("/");
    } else {
      try {
        await deleteDoc(doc(db, "moodboards", id));
        router.replace("/");
      } catch (error) {
        console.error("Error deleting moodboard:", error.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!moodboard) return <p>Error: Moodboard not found</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar renameTitle={renameTitle} deleteMoodboard={deleteMoodboard} title={moodboard.title} />
      <div className="export-content bg-white flex-grow flex m-8 shadow-lg">
      </div>
      <Toolbar />
    </div>
  );
}
