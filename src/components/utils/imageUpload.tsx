import { storage, auth } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
      console.error("Error uploading image:", error);
      return null;
    }
  } else {
    // LocalStorage Upload for Guests
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result as string;
        sessionStorage.setItem(`guest_image_${Date.now()}`, dataURL);
        resolve(dataURL);
      };
      reader.readAsDataURL(file);
    });
  }
};
