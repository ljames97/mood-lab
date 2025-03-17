import { storage, auth } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { saveImageToIndexedDB } from "./indexedDBUtils";

// Upload image (Firebase for logged-in users, IndexedDB for guests)
export const uploadImage = async (file: File, guest: boolean): Promise<string | null> => {
  if (!file) return null;

  if (!guest) {
    // Firebase Upload for Logged-in Users
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const storageRef = ref(storage, `uploaded_images/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      return null;
    }
  } else {
    // IndexedDB Upload for Guests
    return await saveImageToIndexedDB(file);
  }
};
