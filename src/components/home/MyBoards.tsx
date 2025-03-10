// MyBoards.tsx

import dummyBoards from "@/data";
import BoardWidget from "./BoardWidget";

export default function MyBoards() {
  return (
    <div className="my-12 flex flex-col items-center justify-center">
      {/* <button className="p-4 mb-4 text-white bg-primary-darkest rounded-3xl">New Board</button> */}
        <button className="absolute left-10 top-35 flex rounded-full shadow-md bg-primary-darkest p-4 mb-6 z-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" version="1.1" id="Capa_1" width="20px" height="20px" viewBox="0 0 45.402 45.402">
            <g>
              <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
            </g>
          </svg>
        </button>
      <div className="mt-18 gap-8 grid grid-cols-2 w-3/4 place-items-center">
        {dummyBoards.map((board, index) => (
          <BoardWidget board={board} key={index} />
        ))}
      </div>

    </div>
  )
}