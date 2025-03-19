import { useTheme } from "@/store/ThemeContext";
import { useEffect, useRef } from "react";

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

  return (
      <div ref={modalRef} className="p-4 fixed top-30 right-5 bg-white rounded-lg shadow-lg">
        <div className="flex gap-4">
          {["#4C1D3D", "#1D4C3D", "#D46A1C", "#1D3D4C"].map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-full cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            ></div>
          ))}
        </div>
      </div>
  );
}
