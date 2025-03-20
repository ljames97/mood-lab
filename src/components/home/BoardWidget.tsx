// BoardWidget.tsx

import Image from "next/image";

export default function BoardWidget({ board }) {
  return (
    <div className="flex flex-col w-fit gap-2 items-center text-black">
      <div className="hover:bg-black/10 bg-white shadow-lg w-[150px] h-[150px] relative overflow-hidden rounded-lg">
        {board.cover ? (
          <Image
          src={board.cover}
          alt="Cover Photo"
          layout="fill"  
          objectFit="cover"
          className="rounded-lg"
        />
        ) : (
          ''
        )}

      </div>
      <h2>{board.title}</h2>
    </div>
  )
}