"use client";

import BoardWidget from "./BoardWidget";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import { createMoodboard } from "../utils/moodboardUtils";
import { onAuthStateChanged } from "firebase/auth";

export default function MyBoards() {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const isGuest = localStorage.getItem("guest") === "true";

  // Track authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Fetch Moodboards when user is set
  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);

      if (isGuest) {
        const guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
        setBoards(guestBoards);
        setLoading(false);
        return;
      }

      if (!user) return; // Wait until user is loaded

      try {
        const q = query(collection(db, "moodboards"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userBoards = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBoards(userBoards);
      } catch (error) {
        console.error("Error fetching moodboards:", error.message);
      }
      setLoading(false);
    };

    fetchBoards();
  }, [isGuest, user]); // Re-run when `user` or `isGuest` changes

  const handleCreateProject = async () => {
    try {
      let moodboardId;

      if (isGuest) {
        const newBoard = {
          id: `guest_${Date.now()}`,
          title: "Untitled",
          description: "",
          createdAt: new Date().toISOString(),
        };

        const guestBoards = JSON.parse(localStorage.getItem("guest_moodboards") || "[]");
        guestBoards.push(newBoard);
        localStorage.setItem("guest_moodboards", JSON.stringify(guestBoards));
        moodboardId = newBoard.id;
      } else {
        moodboardId = await createMoodboard("Untitled", "");
      }

      router.push(`/moodboard/${moodboardId}`);
    } catch (error) {
      console.error("Failed to create project:", error.message);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  const handleBoardClick = (board) => {
    router.push(`/moodboard/${board.id}`);
  }

  return (
    <div className="my-12 flex flex-col items-center justify-center">
      <button onClick={handleCreateProject} className="hover:cursor-pointer absolute left-10 top-35 flex rounded-full shadow-md bg-primary-darkest p-4 mb-6 z-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 45.402 45.402">
          <g>
            <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
          </g>
        </svg>
      </button>
      <div className="mt-18 gap-8 grid grid-cols-2 w-3/4 place-items-center md:grid-cols-3 lg:grid-cols-4 md:gap-16 md:w-full">
        {boards.map((board, index) => (
          <div className="hover:cursor-pointer" onClick={() => handleBoardClick(board)}>
            <BoardWidget board={board} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
