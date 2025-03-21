"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Modal({ children }) {
  const pathname = usePathname();
  const isModalOpen = pathname === "/account";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isModalOpen]);

  return (
    <motion.div
    initial={{ x: "100%" }}
      animate={{ x: isModalOpen ? "0%" : "100%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] bg-primary-darkest md:w-1/3 lg:w-1/4 md:ml-auto shadow-xl"
      >
      {children}
    </motion.div>
  );
}
