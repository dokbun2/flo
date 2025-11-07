"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
  productId: string;
  href?: string;
}

export function ProductCard({
  imageUrl,
  title,
  price,
  originalPrice,
  reviewCount,
  rating,
  productId,
  href,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const productHref = href || `/products/${productId}`;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link
      href={productHref}
      className="group block bg-white rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-neutral-100">
        <Image
          src={imageError ? "/placeholder-product.svg" : imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImageError(true)}
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-neutral-900 line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-base font-bold text-primary-600">
            {formatPrice(price)}
          </span>
        </div>

        {/* Rating & Reviews */}
        {rating !== undefined && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-neutral-200 text-neutral-200"
                  }`}
                />
              ))}
            </div>
            {reviewCount !== undefined && (
              <span className="text-xs text-neutral-500">({reviewCount})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
