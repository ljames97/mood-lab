// ProfilePhoto

import { defaultProfile } from "@/assets";
import Image from "next/image";

export default function ProfilePhoto() {
  return (
    <Image src={defaultProfile} alt="Profile" width={40} height={40} priority />
  )
}