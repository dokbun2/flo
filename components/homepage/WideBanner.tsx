import Image from "next/image";
import Link from "next/link";

export interface WideBannerProps {
  imageUrl: string;
  alt: string;
  href: string;
  height?: number;
}

export function WideBanner({ imageUrl, alt, href, height = 200 }: WideBannerProps) {
  return (
    <Link
      href={href}
      className="block w-full rounded-lg overflow-hidden hover:opacity-90 transition-opacity duration-200 my-10"
    >
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </Link>
  );
}
