'use client';

import { db } from "@/config/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { openDB } from "idb";

const DB_NAME = "MoodboardDB";

// Initialize IndexedDB
export async function initDB() {
  return openDB(DB_NAME, 2, { // Change version (was 1, now 2)
    upgrade(db, oldVersion, newVersion) {
      console.log(`⚙️ Upgrading IndexedDB from ${oldVersion} → ${newVersion}`);

      // Ensure both stores exist
      if (!db.objectStoreNames.contains("moodboards")) {
        db.createObjectStore("moodboards");
        console.log("Created IndexedDB store: moodboards");
      }
      if (!db.objectStoreNames.contains("guest_images")) {
        db.createObjectStore("guest_images");
        console.log("Created IndexedDB store: guest_images");
      }
    },
  });
}


// Save Moodboard to IndexedDB
export async function saveMoodboardToIndexedDB(id, data) {
  try {
    const db = await initDB();
    const tx = db.transaction("moodboards", "readwrite");
    await tx.store.put(data, id);
    await tx.done;
  } catch (error) {
    console.error("Error saving moodboard to IndexedDB:", error);
  }
}

// Load Moodboard from IndexedDB
export async function loadMoodboardFromIndexedDB(id) {
  try {
    const db = await initDB();
    const data = await db.get("moodboards", id);
    console.log(`Loaded Moodboard ${id} from IndexedDB`);
    return data || null;
  } catch (error) {
    console.error("Error loading moodboard from IndexedDB:", error);
    return null;
  }
}

// Save Image to IndexedDB
export async function saveImageToIndexedDB(file: File): Promise<string> {
  try {
    const db = await initDB(); // Ensure DB is initialized
    console.log(db)
    const imageId = `guest_image_${crypto.randomUUID()}`;
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const dataURL = reader.result as string;
          const tx = db.transaction("guest_images", "readwrite"); // Ensure transaction is created
          const store = tx.objectStore("guest_images");
          console.log(tx, store)

          await store.put(dataURL, imageId); // Put data into IndexedDB
          await tx.done; // Ensure transaction is committed

          console.log(`Image saved to IndexedDB: ${imageId}`);
          resolve(imageId); // Return image ID for later retrieval
        } catch (error) {
          console.error("Error saving image to IndexedDB:", error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert file to Base64
    });
  } catch (error) {
    console.error("Error initializing IndexedDB for image:", error);
    return null;
  }
}


// Load Image from IndexedDB
export async function loadImageFromIndexedDB(id: string): Promise<string | null> {
  try {
    const db = await initDB();
    const data = await db.get("guest_images", id);
    return data || null;
  } catch (error) {
    console.error("Error loading image from IndexedDB:", error);
    return null;
  }
}

export const deleteMoodboardDB = async (id, isGuest) => {
  if (!id) return;

  if (isGuest) {
    try {
      // Remove from IndexedDB
      const db = await initDB();
      const tx = db.transaction(['moodboards', 'guest_images'], "readwrite");

      // Delete Moodboard from IndexedDB
      await tx.objectStore('moodboards').delete(id);
      console.log(`Moodboard ${id} deleted from IndexedDB`);

      // Delete All Images Associated with the Moodboard
      const imageStore = tx.objectStore('guest_images');
      const allImages = await imageStore.getAllKeys();

      for (const imageKey of allImages) {
        if (imageKey.includes(id)) { // Assuming images contain moodboard ID
          await imageStore.delete(imageKey);
          console.log(`Deleted image: ${imageKey}`);
        }
      }

      await tx.done;

      // Remove from localStorage (if applicable)
      let guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
      guestBoards = guestBoards.filter(board => board.id !== id);
      localStorage.setItem("guest_moodboards", JSON.stringify(guestBoards));

      console.log(`Successfully deleted moodboard and images for guest ${id}`);

    } catch (error) {
      console.error("Error deleting moodboard and images from IndexedDB:", error);
    }
  } else {
    try {
      // Delete from Firebase Firestore
      await deleteDoc(doc(db, "moodboards", id));
      console.log(`Deleted moodboard ${id} from Firebase`);
    } catch (error) {
      console.error("Error deleting moodboard from Firestore:", error.message);
    }
  }
};