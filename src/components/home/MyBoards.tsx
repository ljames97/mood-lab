// MyBoards.tsx

import dummyBoards from "@/data";
import BoardWidget from "./BoardWidget";

export default function MyBoards() {
  return (
    <div className=" my-12 flex flex-col items-center justify-center">
      <h1 className="text-center text-4xl">My Boards</h1>
      <button className="mt-8 p-4 bg-primary-darkest rounded-3xl text-white px-6">Create</button>
      <div className="mt-8 gap-8 grid grid-cols-2 w-3/4 place-items-center">
        {dummyBoards.map((board, index) => (
          <BoardWidget board={board} key={index} />
        ))}
      </div>

    </div>
  )
}