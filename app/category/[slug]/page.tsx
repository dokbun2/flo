"use client";

import { use } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { ProductGrid } from "@/components/homepage/ProductGrid";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// 카테고리 매핑 (영문 slug -> 한글 카테고리명)
const categoryMap: Record<string, string> = {
  "bouquet": "꽃다발",
  "opening": "개업축하",
  "promotion": "승진/취임",
  "wedding": "결혼/장례",
  "planterior": "플랜테리어",
  "masterpiece": "명화리안",
  "bucket-orchid": "양동이란",
  "seasonal": "시즌상품",
  "celebration": "축하화환",
  "condolence": "근조화환",
  "plant": "관엽식물",
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { products } = useProducts();

  // URL 디코딩 (한글 카테고리명 처리)
  const decodedSlug = decodeURIComponent(slug);

  // 영문 slug를 한글로 변환하거나, 이미 한글이면 그대로 사용
  const categoryName = categoryMap[decodedSlug] || decodedSlug;

  // 카테고리에 해당하는 상품 필터링
  const categoryProducts = products.filter(
    (product) =>
      product.status === "판매중" &&
      product.category === categoryName
  );

  // ProductGrid 형식으로 변환
  const displayProducts = categoryProducts.map((product) => ({
    id: product.id,
    imageUrl: product.thumbnails?.thumbnail1 || "/placeholder-product.svg",
    title: product.productName,
    price: product.price,
    rating: 4.8,
    reviewCount: 0,
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            홈
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </div>
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pb-8">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            {categoryProducts.length}개의 상품이 있습니다
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pb-16">
        {displayProducts.length > 0 ? (
          <ProductGrid products={displayProducts} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              이 카테고리에는 아직 상품이 없습니다.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
