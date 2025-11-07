import { Flower2, Heart, Cake, Gift, TreePine, Home } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "bouquet",
    name: "꽃다발",
    icon: Flower2,
    description: "특별한 날을 위한 아름다운 꽃다발",
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: "arrangement",
    name: "꽃바구니",
    icon: Gift,
    description: "격식있는 축하를 위한 꽃바구니",
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "plant",
    name: "화분",
    icon: TreePine,
    description: "오래도록 함께할 식물",
    color: "bg-green-50 text-green-600",
  },
  {
    id: "interior",
    name: "인테리어",
    icon: Home,
    description: "공간을 빛내는 식물 인테리어",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "celebration",
    name: "축하화환",
    icon: Heart,
    description: "성공을 축하하는 화환",
    color: "bg-red-50 text-red-600",
  },
  {
    id: "wreath",
    name: "근조화환",
    icon: Flower2,
    description: "정성을 담은 근조화환",
    color: "bg-gray-50 text-gray-600",
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">카테고리</h1>
        <p className="text-gray-600">원하시는 카테고리를 선택해주세요</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 hover:shadow-lg">
                <div
                  className={`${category.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
