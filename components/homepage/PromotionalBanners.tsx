import Image from "next/image";
import Link from "next/link";

export interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  href: string;
}

export interface PromotionalBannersProps {
  banners: PromoBanner[];
}

const defaultBanners: PromoBanner[] = [
  {
    id: "trend",
    title: "트렌드픽",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
    href: "/trend",
  },
  {
    id: "subscription",
    title: "정기구독",
    imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop",
    href: "/subscription",
  },
  {
    id: "magazine",
    title: "매거진",
    imageUrl: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&h=600&fit=crop",
    href: "/magazine",
  },
  {
    id: "event",
    title: "이벤트",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=600&fit=crop",
    href: "/event",
  },
];

export function PromotionalBanners({ banners = defaultBanners }: PromotionalBannersProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.href}
          className="group relative aspect-[4/3] rounded-xl overflow-hidden hover:scale-105 transition-all duration-200"
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover group-hover:brightness-110 transition-all duration-200"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white">{banner.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
