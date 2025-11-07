"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

export interface CategoryQuickNavProps {
  categories?: Category[];
}

const defaultCategories: Category[] = [
  {
    id: "bouquet",
    name: "꽃다발",
    imageUrl: "https://cdn.midjourney.com/781b0120-8c5e-4fc7-8d2e-e00f8439266f/0_3.png",
    href: "/category/bouquet",
  },
  {
    id: "opening",
    name: "개업축하",
    imageUrl: "https://cdn.midjourney.com/f3006714-a5da-4371-867a-ec9267d48057/0_3.png",
    href: "/category/opening",
  },
  {
    id: "promotion",
    name: "승진/취임",
    imageUrl: "https://cdn.midjourney.com/653e5ae0-5981-4418-93af-34fed499ea12/0_2.png",
    href: "/category/promotion",
  },
  {
    id: "wedding",
    name: "결혼/장례",
    imageUrl: "https://cdn.midjourney.com/781b0120-8c5e-4fc7-8d2e-e00f8439266f/0_3.png",
    href: "/category/wedding",
  },
  {
    id: "planterior",
    name: "플랜테리어",
    imageUrl: "https://cdn.midjourney.com/f3006714-a5da-4371-867a-ec9267d48057/0_1.png",
    href: "/category/planterior",
  },
  {
    id: "masterpiece",
    name: "명화리안",
    imageUrl: "https://cdn.midjourney.com/653e5ae0-5981-4418-93af-34fed499ea12/0_2.png",
    href: "/category/masterpiece",
  },
  {
    id: "bucket-orchid",
    name: "양동이란",
    imageUrl: "https://cdn.midjourney.com/f3006714-a5da-4371-867a-ec9267d48057/0_3.png",
    href: "/category/bucket-orchid",
  },
  {
    id: "seasonal",
    name: "시즌상품",
    imageUrl: "https://cdn.midjourney.com/781b0120-8c5e-4fc7-8d2e-e00f8439266f/0_3.png",
    href: "/category/seasonal",
  },
];

export function CategoryQuickNav({ categories = defaultCategories }: CategoryQuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Desktop: Grid View */}
      <div className="hidden md:grid grid-cols-8 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border border-neutral-200 hover:shadow-lg hover:scale-105 transition-all duration-200 relative">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
              />
            </div>
            <span className="text-sm font-medium text-neutral-900 text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-gray-50 transition-colors"
        >
          <span>카테고리 선택</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-4 right-4 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={category.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-gray-50 transition-colors ${
                  index !== categories.length - 1 ? "border-b border-neutral-100" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                    unoptimized
                  />
                </div>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
