export default function ExportMenu({ toggleEdit, toggleSubMenu, deleteMoodboard }) {

  const handleRename = () => {
    toggleSubMenu();
    toggleEdit();
  }

  const handleExportPDF = async () => {
    const contentDiv = document.querySelector(".export-content"); // Target the div
    if (!contentDiv) {
      console.error("Export target not found");
      return;
    }

    const htmlContent = contentDiv.outerHTML; // Get HTML content

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "moodboard.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <ul className="text-black text-sm">
        <li onClick={handleRename} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rename</li>
        <li onClick={handleExportPDF} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Export as PDF</li>
        <li onClick={deleteMoodboard} className="px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer">Delete</li>
    </ul>
  )
}