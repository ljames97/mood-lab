'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";
import { deleteMoodboard, renameTitle } from "../utils/moodboardUtils";
import CanvasPage from "./Canvas";
import { Canvas, Rect, Textbox } from "fabric";
import * as fabric from "fabric";
import { uploadImage } from "../utils/imageUpload";
import { loadImageFromIndexedDB, saveMoodboardToIndexedDB } from "../utils/indexedDBUtils";

export default function MoodBoardPage() {
  const params = useParams();
  const router = useRouter();
  const [moodboard, setMoodboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = localStorage.getItem("guest") === "true";
  const fabricRef = useRef(Canvas);
  const fileInputRef = useRef(null);

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

  const saveMoodboard = async () => {
    if (!fabricRef.current) return;
  
    const canvasJSON = JSON.stringify(fabricRef.current.toJSON());
  
    if (isGuest) {
      // Save to localStorage for guests
      await saveMoodboardToIndexedDB(id, canvasJSON);
    } else {
      // Save to Firestore for logged-in users
      try {
        await setDoc(doc(db, "moodboards", id), { 
          canvasState: canvasJSON,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
  
        console.log("Moodboard auto-saved to Firestore.");
      } catch (error) {
        console.error("Error saving to Firestore:", error.message);
      }
    }
  };

  // Auto-save every 5 seconds instead of listening to every object change
  useEffect(() => {  
    const interval = setInterval(() => {
      saveMoodboard();
    }, 1000);
  
    return () => clearInterval(interval); // Cleanup when unmounting
  }, []);
  
  const addRectangle = () => {
    if (!fabricRef.current) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "black",
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
      fontSize: 18,
      fill: "black",
      fontFamily: 'sans-serif',
      editable: true,
      selectable: true,
      width: 100,
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text); // Select the text box immediately
    text.bringToFront(); // Bring text to front
    fabricRef.current.renderAll(); // Force canvas to update
  };

  const triggerFileUpload = () => {
    console.log('click')
    fileInputRef.current?.click();
  };

  // Handle Image Upload & Add to Canvas
  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricRef.current) return;
  
    const imageId = await uploadImage(file, isGuest);
    if (!imageId) return;
  
    // ✅ If guest, load from IndexedDB
    let imageUrl = imageId;
    if (isGuest) {
      imageUrl = await loadImageFromIndexedDB(imageId);
      if (!imageUrl) return console.error("Error: Image not found in IndexedDB.");
    }
  
    const imgElement = new window.Image();
    imgElement.src = imageUrl;
  
    imgElement.onload = () => {
      const img = new fabric.Image(imgElement, {
        left: 150,
        top: 150,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: true,
      });
  
      fabricRef.current!.add(img);
      fabricRef.current!.renderAll();
    };
  
    event.target.value = ""; // Clear input
  };

  const addStickyNote = () => {
    if (!fabricRef.current) return;
  
    const stickyNote = new fabric.Textbox("Add note...", {
      left: 150,
      top: 150,
      width: 120,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      backgroundColor: "#FFEB3B",
      editable: true,
      selectable: true,
      lineHeight: 1.5,
      textAlign: "left",
      wrap: "word",
      splitByGrapheme: true,
    });
  
    stickyNote.set("height", 120);

    // Disable text scaling to prevent distortion
  stickyNote.setControlsVisibility({
    mt: false, // Middle Top
    mb: false, // Middle Bottom
    ml: false, // Middle Left
    mr: false, // Middle Right
  });
  
  fabricRef.current.add(stickyNote);
  fabricRef.current.setActiveObject(stickyNote);
  fabricRef.current.bringToFront(stickyNote);
  fabricRef.current.renderAll();
  };


  if (loading) return <p>Loading...</p>;
  if (!moodboard) return <p>Error: Moodboard not found</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar handleRenameTitle={handleRenameTitle} handleDeleteMoodboard={handleDeleteMoodboard} title={moodboard.title} />
      <CanvasPage id={id} setFabricCanvas={(canvas) => (fabricRef.current = canvas)} />
      <Toolbar triggerFileUpload={triggerFileUpload} addRectangle={addRectangle} addText={addText} addStickyNote={addStickyNote} />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={addImage}
      />
    </div>
  );
}
