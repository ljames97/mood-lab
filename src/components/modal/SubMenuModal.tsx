// subMenuModal.tsx

import { useEffect, useRef } from "react";

export default function SubMenuModal({ children, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal when clicking outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="absolute right-5 top-15 w-48 bg-white shadow-lg rounded-lg z-50 py-4">
      {children}
    </div>
  );
}