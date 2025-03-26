'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [moodboard, setMoodboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Get guest flag
  useEffect(() => {
    if (typeof window !== "undefined") {
      const guestVal = localStorage.getItem("guest");
      setIsGuest(guestVal === "true");
    }
  }, []);

  // Fetch moodboard once guest flag and id are available
  useEffect(() => {
    if (isGuest === null || !id) return;

    const fetchMoodboard = async () => {
      try {
        if (isGuest && id.startsWith("guest_")) {
          const guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
          const guestBoard = guestBoards.find((board: any) => board.id === id);

          if (!guestBoard) {
            console.error("Guest moodboard not found.");
            router.replace("/");
            return;
          }

          setMoodboard(guestBoard);
        } else {
          const docRef = doc(db, "moodboards", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setMoodboard(docSnap.data());
          } else {
            console.error("Moodboard not found in Firestore.");
            router.replace("/");
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch moodboard:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodboard();
  }, [id, isGuest]);

  // Auto-save logic
  useEffect(() => {
    const interval = setInterval(() => {
      saveMoodboard();
    }, 1000);

    return () => clearInterval(interval);
  }, [isGuest]);

  const saveMoodboard = async () => {
    if (!fabricRef.current || !id) return;

    const canvasJSON = JSON.stringify(fabricRef.current.toJSON());

    try {
      if (isGuest) {
        await saveMoodboardToIndexedDB(id, canvasJSON);
      } else {
        await setDoc(
          doc(db, "moodboards", id),
          {
            canvasState: canvasJSON,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log("Saved to Firestore");
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const addRectangle = () => {
    if (!fabricRef.current) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "black",
      width: 100,
      height: 100,
      selectable: true,
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
      fontFamily: "sans-serif",
      editable: true,
      selectable: true,
      width: 100,
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    text.bringToFront();
    fabricRef.current.renderAll();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricRef.current) return;

    const imageId = await uploadImage(file, isGuest);
    if (!imageId) return;

    let imageUrl = imageId;
    if (isGuest) {
      imageUrl = await loadImageFromIndexedDB(imageId);
      if (!imageUrl) return;
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

      fabricRef.current?.add(img);
      fabricRef.current?.renderAll();
    };

    event.target.value = ""; // Reset file input
  };

  const addStickyNote = () => {
    if (!fabricRef.current) return;

    const sticky = new fabric.Textbox("Add note...", {
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
    });

    sticky.set("height", 120);
    sticky.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });

    fabricRef.current.add(sticky);
    fabricRef.current.setActiveObject(sticky);
    fabricRef.current.bringToFront(sticky);
    fabricRef.current.renderAll();
  };

  const handleRenameTitle = async (newTitle: string) => {
    await renameTitle(id, moodboard, newTitle, isGuest, setMoodboard);
  };

  const handleDeleteMoodboard = () => {
    deleteMoodboard(id, isGuest);
    router.replace("/");
  };

  if (loading) return <p>Loading...</p>;
  if (!moodboard) return <p>Error: Moodboard not found</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar
        handleRenameTitle={handleRenameTitle}
        handleDeleteMoodboard={handleDeleteMoodboard}
        title={moodboard.title}
      />
      <CanvasPage id={id} setFabricCanvas={(canvas) => (fabricRef.current = canvas)} />
      <Toolbar
        triggerFileUpload={triggerFileUpload}
        addRectangle={addRectangle}
        addText={addText}
        addStickyNote={addStickyNote}
      />
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
