"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  imageUrl?: string;
  videoUrl?: string;
  alt: string;
  href?: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  overlayImageUrl?: string;
  title?: string;
  subtitle?: string;
}

export function HeroCarousel({
  slides,
  autoPlayInterval = 5000,
  overlayImageUrl,
  title = "특별한 날을 위한",
  subtitle = "아름다운 꽃다발",
}: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [emblaApi, autoPlayInterval, isHovered]);

  return (
    <div
      className="relative w-full -mt-[137px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0 relative h-[500px] md:h-[580px] lg:h-[680px] pt-[137px]"
            >
              {/* Background Video or Image */}
              {slide.videoUrl ? (
                <video
                  src={slide.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : slide.href ? (
                <Link href={slide.href} className="block w-full h-full">
                  <Image
                    src={slide.imageUrl!}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={selectedIndex === 0}
                    sizes="100vw"
                    unoptimized
                  />
                </Link>
              ) : (
                <Image
                  src={slide.imageUrl!}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={selectedIndex === 0}
                  sizes="100vw"
                  unoptimized
                />
              )}

              {/* Overlay Image */}
              {overlayImageUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src={overlayImageUrl}
                    alt="Decorative overlay"
                    fill
                    className="object-cover mix-blend-multiply opacity-30"
                    sizes="100vw"
                  />
                </div>
              )}

              {/* Dark gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {title}
                </h2>
                <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-neutral-900" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-neutral-900" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
