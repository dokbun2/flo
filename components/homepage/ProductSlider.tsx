"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard, ProductCardProps } from "@/components/domain/product/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
}

export interface ProductSliderProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductSlider({ title, products, viewAllHref }: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체보기 →
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_calc(100%-1rem)] min-w-0 sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(25%-0.75rem)]"
              >
                <ProductCard
                  productId={product.id}
                  imageUrl={product.imageUrl}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  reviewCount={product.reviewCount}
                  rating={product.rating}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {products.length > 4 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-neutral-50 rounded-full p-2 shadow-lg transition-all duration-200 hidden md:block"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-900" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-neutral-50 rounded-full p-2 shadow-lg transition-all duration-200 hidden md:block"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-neutral-900" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
