import { db, auth } from "@/config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
