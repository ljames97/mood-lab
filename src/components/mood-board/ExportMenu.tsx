export default function ExportMenu() {
  return (
    <ul className="text-black text-sm">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rename</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Add description</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Export as PDF</li>
        <li className="px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer">Delete</li>
    </ul>
  )
  
}