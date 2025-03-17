import { db, auth } from "@/config/firebaseConfig";
import { collection, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { deleteMoodboardDB } from "./indexedDBUtils";

/**
 * Creates a new moodboard and returns the ID.
 * If the user is a guest, stores it in `localStorage` instead of Firestore.
 */
export const createMoodboard = async (title: string, description: string) => {
  const isGuest = localStorage.getItem("guest") === "true";

  if (isGuest) {
    console.log("Creating Guest Moodboard...");
    // Generate a unique ID for guest moodboards
    const guestBoardId = `guest_${Date.now()}`;
    const guestBoard = { id: guestBoardId, title, description, createdAt: new Date().toISOString() };
    
    // Save to localStorage
    localStorage.setItem(`guest_moodboard_${guestBoardId}`, JSON.stringify(guestBoard));

    return guestBoardId;
  }

  try {
    // Ensure the user is logged in before creating a moodboard in Firestore
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    console.log("Creating Firebase Moodboard...");
    const docRef = await addDoc(collection(db, "moodboards"), {
      title,
      description,
      userId: user.uid,
      createdAt: serverTimestamp(),
      collaborators: []
    });

    return docRef.id;
  } catch (error: any) {
    console.error("Error creating moodboard:", error.message);
    throw new Error(error.message);
  }
};

export const renameTitle = async (id, moodboard, newTitle, isGuest, setMoodboard) => {
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

export const deleteMoodboard = async (id, isGuest) => {
  if (!id) return;

  if (isGuest) {
    let guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
    guestBoards = guestBoards.filter(board => board.id !== id);
    localStorage.setItem("guest_moodboards", JSON.stringify(guestBoards));
  } else {
    try {
      await deleteDoc(doc(db, "moodboards", id));
    } catch (error) {
      console.error("Error deleting moodboard:", error.message);
    }
  }

  deleteMoodboardDB(id, isGuest)
};