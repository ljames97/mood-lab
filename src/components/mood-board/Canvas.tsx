import { useEffect, useRef } from "react"
import { Canvas, Rect, Textbox } from "fabric";

export default function CanvasPage({ setFabricCanvas }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight || 600;

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      width: containerWidth,
      height: containerHeight,
      selection: true,
    });

    setFabricCanvas(canvas);

    // Resize canvas dynamically when window resizes
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      canvas.setWidth(newWidth);
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [setFabricCanvas]);

  return (
    <div ref={containerRef} className="export-content bg-white flex-grow flex m-8 shadow-lg">
      <canvas ref={canvasRef} />
      
    </div>
  )
}