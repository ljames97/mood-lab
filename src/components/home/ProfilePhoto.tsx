// ProfilePhoto

'use client';

import { defaultProfile } from "@/assets";
import { useAuth } from "@/store/AuthContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePhoto({ size }) {
  const [profilePic, setProfilePic] = useState(null);
  const { user } = useAuth();
  const guest = localStorage.getItem('guest');

  useEffect(() => {
    if (user?.photoURL) {
      setProfilePic(user.photoURL);
    } else  if (guest === 'true') {
      setProfilePic(localStorage.getItem("guestProfile") || null);
    } else {
      setProfilePic(null);
    }
  }, [user]);

  return (
    <>
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 20 20" width="40" height="40" fill="white"><path d="M10.713 8.771c.31.112.53.191.743.27.555.204.985.372 1.367.539 1.229.535 1.993 1.055 2.418 1.885.464.937.722 1.958.758 2.997.03.84-.662 1.538-1.524 1.538H1.525c-.862 0-1.554-.697-1.524-1.538a7.36 7.36 0 01.767-3.016c.416-.811 1.18-1.33 2.41-1.866a25.25 25.25 0 011.366-.54l.972-.35a1.42 1.42 0 00-.006-.072c-.937-1.086-1.369-2.267-1.369-4.17C4.141 1.756 5.517 0 8.003 0c2.485 0 3.856 1.755 3.856 4.448 0 2.03-.492 3.237-1.563 4.386.169-.18.197-.253.207-.305a1.2 1.2 0 00-.019.16l.228.082zm-9.188 5.742h12.95a5.88 5.88 0 00-.608-2.402c-.428-.835-2.214-1.414-4.46-2.224-.608-.218-.509-1.765-.24-2.053.631-.677 1.166-1.471 1.166-3.386 0-1.934-.782-2.96-2.33-2.96-1.549 0-2.336 1.026-2.336 2.96 0 1.915.534 2.709 1.165 3.386.27.288.369 1.833-.238 2.053-2.245.81-4.033 1.389-4.462 2.224a5.88 5.88 0 00-.607 2.402z" fill="#fcfaf7"></path></svg> */}
      <Image className="rounded-full" src={profilePic ? profilePic : defaultProfile} alt="Profile" width={size} height={size} priority />
    </>
  )
}