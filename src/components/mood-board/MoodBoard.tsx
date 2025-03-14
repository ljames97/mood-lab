'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";
import { deleteMoodboard, renameTitle } from "../utils/moodboardUtils";
import CanvasPage from "./Canvas";
import { Canvas, Rect, Textbox } from "fabric";

export default function MoodBoardPage() {
  const params = useParams();
  const router = useRouter();
  const [moodboard, setMoodboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = localStorage.getItem("guest") === "true";
  const fabricRef = useRef(Canvas);

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
    router.replace("/");
  }

  const addRectangle = () => {
    if (!fabricRef.current) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "blue",
      width: 100,
      height: 100,
      selectable: true, // Allow dragging and resizing
    });
    fabricRef.current.add(rect);
  };

  const addText = () => {
    if (!fabricRef.current) return;
    const text = new Textbox("Click to edit", {
      left: 200,
      top: 200,
      fontSize: 20,
      fill: "black",
      editable: true,
      selectable: true,
      width: 200,
    });
    fabricRef.current.add(text);
  };

  if (loading) return <p>Loading...</p>;
  if (!moodboard) return <p>Error: Moodboard not found</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar handleRenameTitle={handleRenameTitle} handleDeleteMoodboard={handleDeleteMoodboard} title={moodboard.title} />
      <CanvasPage setFabricCanvas={(canvas) => (fabricRef.current = canvas)}  />
      <Toolbar addRectangle={addRectangle} addText={addText} />
    </div>
  );
}
