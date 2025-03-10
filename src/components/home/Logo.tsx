// Logo.tsx

import { logo } from "@/assets";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex align-center justify-center">
      <Image src={logo} alt="MoodLab Logo" width={200} priority />
    </div>
  )
}