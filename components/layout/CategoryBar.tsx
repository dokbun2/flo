"use client";

import Link from "next/link";

const categories = [
  "축하화환",
  "근조화환",
  "쌀화환",
  "1단·2단화환",
  "동양란",
  "서양란",
  "관엽공부",
  "공기정화식물",
  "금전수·스투키",
  "꽃다발·꽃상자",
  "꽃바구니",
];

export function CategoryBar() {
  return (
    <div className="bg-transparent sticky top-[73px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 overflow-x-auto pb-0 scrollbar-hide justify-center">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="px-4 py-2 text-base text-white whitespace-nowrap font-medium rounded-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
