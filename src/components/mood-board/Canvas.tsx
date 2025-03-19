import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { HexColorPicker } from "react-colorful"; 
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/config/firebaseConfig";
import { loadMoodboardFromIndexedDB } from "../utils/indexedDBUtils";
import { deleteObject, ref } from "firebase/storage";

export default function CanvasPage({id, setFabricCanvas }) {
  const canvasRef = useRef(null);
  const isGuest = localStorage.getItem("guest") === "true";
  const containerRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const [toolPosition, setToolPosition] = useState({ top: 0, left: 0 });

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

    const loadMoodboard = async () => {
      if (!canvas) return;
  
      let canvasState = isGuest
        ? await loadMoodboardFromIndexedDB(id)
        : (await getDoc(doc(db, "moodboards", id))).data()?.canvasState;
  
      if (!canvasState) {
        console.warn("No saved moodboard found.");
        return;
      }
  
      console.log("Loading canvas state:", canvasState);
  
      canvas.loadFromJSON(canvasState, () => {
        canvas.renderAll();
        canvas.requestRenderAll();
        console.log("Moodboard loaded successfully.");
      });
    };
  
    loadMoodboard();

    const updateToolPosition = (obj) => {
      if (!obj || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const zoom = canvas.getZoom();
      const { left, top, width, height } = obj;

      const transformedLeft = canvasRect.left + left * zoom;
      const transformedTop = canvasRect.top + top * zoom

      setToolPosition({ top: transformedTop, left: transformedLeft });
    };

    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (!obj) return;
  
      if (obj.left! < 0) obj.left = 0;
      if (obj.top! < 0) obj.top = 0;
      if (obj.left! + obj.width! * obj.scaleX! > canvas.width) {
        obj.scaleX = (canvas.width - obj.left!) / obj.width!;
      }
      if (obj.top! + obj.height! * obj.scaleY! > canvas.height) {
        obj.scaleY = (canvas.height - obj.top!) / obj.height!;
      }
    });

    // Resize canvas dynamically
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      canvas.setWidth(newWidth);
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // When an object is selected
    canvas.on("selection:created", (e) => {
      if (e.selected.length > 0) {
        const obj = e.selected[0];
        setSelectedObject(obj);
        updateToolPosition(obj);
      }
    });

    // When an object is moved or transformed
    canvas.on("object:modified", (e) => {
      if (e.target) updateToolPosition(e.target);
    });

    // When selection is cleared
    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      setShowColorPicker(false);
    });

    // Click outside to remove selection
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelectedObject(null);
        setShowColorPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
      canvas.dispose();
    };
  }, [setFabricCanvas]);



  // Handle Color Change
  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (selectedObject) {
      selectedObject.set("fill", newColor);
      selectedObject.canvas.renderAll();
    }
  };

  // Delete the Selected Object
  const deleteSelectedObject = () => {
    if (!selectedObject || !selectedObject.canvas) return;
    console.log('DELETE IMAGE', selectedObject)


    if (selectedObject.type === "image" && selectedObject._element?.src) {
      const imageUrl = selectedObject._element.src;
      console.log('DELETING IMAGE')

      // Delete from Firebase Storage if it's a Firebase image
      if (imageUrl.includes("firebasestorage.googleapis.com")) {
        const imagePath = decodeURIComponent(imageUrl.split("?")[0].split("/o/")[1]);
        const storageRef = ref(storage, imagePath);

        deleteObject(storageRef)
          .then(() => console.log(`Deleted image from Firebase: ${imagePath}`))
          .catch((error) => console.error("Error deleting image from Firebase:", error));
      }
    }

    selectedObject.canvas.remove(selectedObject);
    setSelectedObject(null);
  };

  return (
    <div ref={containerRef} className="export-content bg-white flex-grow flex m-8 shadow-lg relative">
      <canvas ref={canvasRef} />
      
      {/* Tool Icons - Always stay next to selected object */}
      {selectedObject && (
        <div
          className="absolute flex space-x-2 p-2 bg-white shadow-md rounded-lg"
          style={{
            top: toolPosition.top,
            left: toolPosition.left,
            transform: "translateY(-50%)",
          }}
        >
          {/* Pipette (Color Picker) */}
          <button onClick={() => setShowColorPicker(!showColorPicker)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" width="24" version="1.1" id="Capa_1" viewBox="0 0 296.135 296.135">
            <path d="M284.5,11.635C276.997,4.132,267.021,0,256.411,0s-20.586,4.132-28.089,11.635l-64.681,64.68l-6.658-6.658  c-2.777-2.777-6.2-4.512-9.786-5.206c-0.598-0.116-1.2-0.202-1.804-0.26s-1.211-0.087-1.817-0.087s-1.213,0.029-1.817,0.087  s-1.206,0.145-1.804,0.26c-3.585,0.694-7.009,2.43-9.786,5.206v0c-1.388,1.388-2.516,2.938-3.384,4.59  c-0.289,0.55-0.55,1.112-0.781,1.683c-0.694,1.712-1.128,3.505-1.302,5.317c-0.058,0.604-0.087,1.211-0.087,1.817  c0,1.213,0.116,2.426,0.347,3.621c0.347,1.793,0.954,3.545,1.822,5.196c0.868,1.651,1.996,3.201,3.384,4.59l4.319,4.319  L21.468,213.811c-1.434,1.434-2.563,3.143-3.316,5.025l-16.19,40.387c-3.326,8.298-2.338,17.648,2.644,25.013  c5.04,7.451,13.356,11.899,22.244,11.899c3.432,0,6.817-0.659,10.063-1.961L77.3,277.984c1.882-0.754,3.592-1.883,5.025-3.316  l113.021-113.021l4.318,4.318c0.463,0.463,0.944,0.897,1.44,1.302c0.993,0.81,2.049,1.504,3.15,2.083  c2.752,1.446,5.785,2.169,8.818,2.169l0,0c0.029,0,0.058-0.004,0.087-0.004c1.791-0.008,3.58-0.264,5.312-0.777  c2.345-0.694,4.583-1.851,6.569-3.471c0.497-0.405,0.977-0.839,1.44-1.302v0c2.314-2.314,3.905-5.077,4.772-8.009  c0.694-2.345,0.926-4.798,0.694-7.216c-0.116-1.209-0.347-2.408-0.694-3.581s-0.81-2.318-1.388-3.419  c-0.868-1.651-1.996-3.201-3.384-4.59l-6.658-6.658l64.68-64.68C299.988,52.326,299.988,27.124,284.5,11.635z M63.285,251.282  l-30.764,12.331l12.332-30.763l110.848-110.848l18.432,18.432L63.285,251.282z"/>
          </svg>
          </button>

          {/* Bin (Delete Object) */}
          <button onClick={deleteSelectedObject}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 11V17" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11V17" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 7H20" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </button>
        </div>
      )}

      {/* Color Picker Modal (Free to Appear Anywhere) */}
      {showColorPicker && (
        <div
          className="fixed top-20 right-20 p-4 bg-white shadow-lg rounded-md"
        >
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
}
