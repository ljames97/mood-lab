// ProfilePhoto

'use client';

import { defaultProfile } from "@/assets";
import { logOut } from "@/config/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePhoto() {
  const router = useRouter();

  const handleLogout = async () => {
    await logOut()
    router.push('/auth');
  }
  return (
    <div onClick={handleLogout}>
      <Image src={defaultProfile} alt="Profile" width={40} height={40} priority />
    </div>
  )
}