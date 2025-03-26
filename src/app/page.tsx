"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HomePage from "@/components/home/HomePage";
import Auth from "@/components/auth/Auth";
import { useAuth } from "@/store/AuthContext";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isGuest, setIsGuest] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const guest = localStorage.getItem("guest");
      setIsGuest(guest);
    }
  }, []);

  // Redirect to Auth page if user is not logged in
  useEffect(() => {
    if (!loading && !user && isGuest == 'false' ) {
      router.push('/auth');
    }
  }, [user, loading, router, isGuest]);

  if (loading) return <p>Loading...</p>;

  if (user || isGuest === 'true') {
    return <HomePage />;
  }
  
  return <Auth />;}
