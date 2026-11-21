"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** The salon photo set used by the auto-playing hero banner. */
const HERO_IMAGES = [
  { src: "/images/banners/image1.png", alt: "A stylist at work in the Stylevique salon" },
  { src: "/images/banners/image2.png", alt: "A classic barbering session in a warm studio" },
  { src: "/images/banners/image3.png", alt: "The modern salon floor with styling chairs" },
  { src: "/images/banners/image4.png", alt: "A stylist finishing a precise haircut" },
  { src: "/images/banners/image5.png", alt: "A tailored cut in a considered setting" },
  { src: "/images/banners/image6.png", alt: "The quiet styling room between appointments" },
  { src: "/images/banners/image7.png", alt: "A close look at a signature haircut" },
  { src: "/images/banners/image8.png", alt: "A makeup ritual in progress at Stylevique" },
  { src: "/images/banners/image9.png", alt: "A guest enjoying a styled finish" },
  { src: "/images/banners/image10.png", alt: "A stylist and guest during a consultation" },
  { src: "/images/banners/image11.png", alt: "The finishing touches of a salon visit" },
] as const;

const SLIDE_DURATION = 5000;

/**
 * Auto-playing hero background. Images cross-fade on a timer, pause while the
 * visitor hovers, and can be chosen directly with the dots. The hero copy and
 * buttons stay in the server-rendered page above this layer.
 */
export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_IMAGES.map((image, index) => (
        <div
          key={image.src}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={image.src}
            alt={index === active ? image.alt : ""}
            fill
            priority={index === 0}
            sizes="100vw"
            quality={80}
            className="object-cover object-center dark:brightness-110"
          />
        </div>
      ))}

      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {HERO_IMAGES.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show salon photo ${index + 1}`}
            aria-current={index === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === active
                ? "w-7 bg-on-dark-text"
                : "w-1.5 bg-on-dark-text/45 hover:bg-on-dark-text/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}
