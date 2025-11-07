"use client";

import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { CategoryQuickNav } from "@/components/homepage/CategoryQuickNav";
import { PromotionalBanners } from "@/components/homepage/PromotionalBanners";
import { ProductSlider } from "@/components/homepage/ProductSlider";
import { ProductGrid } from "@/components/homepage/ProductGrid";
import { WideBanner } from "@/components/homepage/WideBanner";
import { useProducts } from "@/contexts/ProductContext";

// Mock data for development
const heroSlides = [
  {
    id: "1",
    videoUrl: "https://cdn.midjourney.com/video/d39eb59e-d9b1-41e1-8f31-ed48434a4369/0.mp4",
    alt: "메인 배경 비디오",
    href: "/collection/artist",
  },
  {
    id: "2",
    imageUrl: "https://cdn.midjourney.com/653e5ae0-5981-4418-93af-34fed499ea12/0_0.png",
    alt: "아티스트 컬렉션 2",
    href: "/collection/artist",
  },
];

const mdPickProducts = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    title: "로맨틱 핑크 장미 꽃다발",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop",
    title: "프리미엄 튤립 믹스",
    price: 38000,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&h=400&fit=crop",
    title: "화이트 수국 꽃바구니",
    price: 52000,
    originalPrice: 62000,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=400&fit=crop",
    title: "엘레강스 백합 부케",
    price: 48000,
    rating: 4.6,
    reviewCount: 92,
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=400&fit=crop",
    title: "스프링 가든 믹스",
    price: 42000,
    originalPrice: 50000,
    rating: 4.8,
    reviewCount: 78,
  },
];

const newProducts = [
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
    title: "프레시 데이지 꽃다발",
    price: 35000,
    rating: 4.5,
    reviewCount: 45,
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop",
    title: "선샤인 해바라기 부케",
    price: 40000,
    originalPrice: 48000,
    rating: 4.7,
    reviewCount: 67,
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&h=400&fit=crop",
    title: "퍼플 라벤더 세트",
    price: 32000,
    rating: 4.6,
    reviewCount: 34,
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    title: "트로피컬 믹스 화분",
    price: 55000,
    rating: 4.8,
    reviewCount: 56,
  },
  {
    id: "10",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    title: "클래식 카네이션 부케",
    price: 28000,
    originalPrice: 35000,
    rating: 4.4,
    reviewCount: 89,
  },
];

const bestsellerProducts = [
  {
    id: "11",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=400&fit=crop",
    title: "베스트 로즈 컬렉션",
    price: 58000,
    originalPrice: 68000,
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: "12",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
    title: "프리미엄 혼합 꽃다발",
    price: 65000,
    rating: 4.8,
    reviewCount: 198,
  },
  {
    id: "13",
    imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop",
    title: "럭셔리 백합 바스켓",
    price: 72000,
    originalPrice: 85000,
    rating: 4.9,
    reviewCount: 167,
  },
  {
    id: "14",
    imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop",
    title: "스페셜 튤립 세트",
    price: 48000,
    rating: 4.7,
    reviewCount: 145,
  },
  {
    id: "15",
    imageUrl: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&h=400&fit=crop",
    title: "엘레강스 수국 화분",
    price: 62000,
    originalPrice: 75000,
    rating: 4.8,
    reviewCount: 189,
  },
  {
    id: "16",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    title: "로맨틱 핑크 믹스",
    price: 52000,
    rating: 4.6,
    reviewCount: 134,
  },
  {
    id: "17",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=400&fit=crop",
    title: "프레시 화이트 부케",
    price: 45000,
    originalPrice: 55000,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "18",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
    title: "가든 플라워 바스켓",
    price: 58000,
    rating: 4.8,
    reviewCount: 178,
  },
];

export default function HomePage() {
  const { products } = useProducts();

  // 전역 스토어의 상품을 ProductSlider/ProductGrid 형식으로 변환
  const convertToDisplayProduct = (product: typeof products[0]) => ({
    id: product.id,
    imageUrl: product.thumbnails?.thumbnail1 || "/placeholder-product.svg",
    title: product.productName,
    price: product.price,
    rating: 4.8, // 추후 리뷰 시스템 구현 시 실제 데이터로 대체
    reviewCount: 0,
  });

  // 판매중인 상품만 필터링
  const activeProducts = products.filter((p) => p.status === "판매중");

  // 최신 상품 (등록일 기준 정렬)
  const newProducts = [...activeProducts]
    .sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime())
    .slice(0, 5)
    .map(convertToDisplayProduct);

  // 베스트셀러 (여기서는 전체 상품, 추후 판매량 기준 정렬 가능)
  const bestsellerProducts = [...activeProducts]
    .slice(0, 8)
    .map(convertToDisplayProduct);

  // MD 추천 (여기서는 처음 5개, 추후 추천 로직 추가 가능)
  const mdPickProducts = [...activeProducts]
    .slice(0, 5)
    .map(convertToDisplayProduct);

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel
        slides={heroSlides}
        title="아티스트 컬렉션"
        subtitle="by GODA"
      />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Category Quick Navigation */}
        <div className="mt-8">
          <CategoryQuickNav />
        </div>

        {/* Promotional Banners */}
        <div className="mt-8">
          <PromotionalBanners />
        </div>

        {/* Spacer */}
        <div className="h-10" />

        {/* MD's Pick Product Slider */}
        {mdPickProducts.length > 0 && (
          <ProductSlider
            title="MD의 추천"
            products={mdPickProducts}
            viewAllHref="/products/md-pick"
          />
        )}

        {/* Spacer */}
        <div className="h-10" />

        {/* New Products Slider */}
        {newProducts.length > 0 && (
          <ProductSlider
            title="신상품"
            products={newProducts}
            viewAllHref="/products/new"
          />
        )}

        {/* Wide Banner */}
        <WideBanner
          imageUrl="https://cdn.midjourney.com/f3006714-a5da-4371-867a-ec9267d48057/0_0.png"
          alt="정기 구독 서비스 - 매주 신선한 꽃을 받아보세요"
          href="/subscription"
        />

        {/* Spacer */}
        <div className="h-10" />

        {/* Bestseller Product Grid */}
        {bestsellerProducts.length > 0 && (
          <ProductGrid title="베스트셀러" products={bestsellerProducts} />
        )}

        {/* Bottom Spacer */}
        <div className="h-16" />
      </div>
    </div>
  );
}
