import { useTheme } from "@/store/ThemeContext";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ColorModal({ colorModal, setColorModal }) {
  const { setThemeColor } = useTheme();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setColorModal(!colorModal);
      }
    };

    if (colorModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorModal]);

  if (!colorModal) return null;

  const handleColorChange = (color) => {
    setThemeColor(color);
    setColorModal(false)
  };

  const colors = ["#4C1D3D", "#1D4C3D", "#D46A1C", "#1D3D4C"];

  return (
    <motion.div
    ref={modalRef}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.1, ease: "easeOut" }}
    className="p-4 fixed top-30 right-5 bg-white rounded-lg shadow-lg"
  >
    <div className="flex gap-2">
      {colors.map((color, index) => (
        <motion.div
          key={color}
          className="w-8 h-8 rounded-full cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => handleColorChange(color)}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
        />
      ))}
    </div>
  </motion.div>
  );
}
