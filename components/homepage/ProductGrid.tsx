import { ProductCard } from "@/components/domain/product/ProductCard";

export interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
}

export interface ProductGridProps {
  title: string;
  products: Product[];
  columns?: number;
}

export function ProductGrid({ title, products, columns = 4 }: ProductGridProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            productId={product.id}
            imageUrl={product.imageUrl}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            reviewCount={product.reviewCount}
            rating={product.rating}
          />
        ))}
      </div>
    </div>
  );
}
