// ProfilePhoto

import { defaultProfile } from "@/assets";
import Image from "next/image";

export default function ProfilePhoto() {
  return (
    <Image src={defaultProfile} alt="Profile" width={35} height={35} priority />
  )
}