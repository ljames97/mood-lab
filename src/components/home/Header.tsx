// Header.tsx

import Logo from "./Logo";
import ProfilePhoto from "./ProfilePhoto";

export default function Header() {
  return (
    <div className="flex justify-between align-center p-6 bg-primary-darkest">
      <Logo />
      <ProfilePhoto />

    </div>
  )
}