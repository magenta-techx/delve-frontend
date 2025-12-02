"use client";

import Image from "next/image";
import * as React from "react";

type Slide = {
  src: string;
  title: string;
  subtitle: string;
};

type Props = {
  slides?: Slide[];
  intervalMs?: number;
};

export default function SimpleAuthPanel({
  slides = [
    {
      src: "/auth-page-slide1.jpg",
      title: "Explore What’s Around",
      subtitle: "Delve connects you to reliable businesses for every moment, every need.",
    },
    {
      src: "/auth-page-slide2.jpg",
      title: "Your Grocery Run, Made Smarter",
      subtitle: "Skip the stress, discover stores, check hours, and shop with confidence.",
    },
    {
      src: "/auth-page-slide3.jpg",
      title: "Make Moments That Matter",
      subtitle: "From weddings to birthdays, Delve helps you plan every detail beautifully.",
    },
  ],
  intervalMs = 6000,
}: Props): JSX.Element {
  const [index, setIndex] = React.useState(0);
  const hasMultiple = slides.length > 1;

  React.useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs, hasMultiple]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      {/* Images stacked with fade */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.src}
              alt={s.title}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover mb-10"
            />
          </div>
        ))}
      </div>

      {/* Bottom caption bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 rounded-b-xl bg-black/90 px-8 py-6 text-white">
        <h2 className="font-karma text-[26px] leading-7">{slides[index]?.title}</h2>
        <p className="mt-1 max-w-[360px] text-[15px] leading-5 opacity-90">{slides[index]?.subtitle}</p>
        {hasMultiple && (
          <div className="mt-4 flex gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === index ? "w-12 bg-primary" : "w-2 bg-[#A48AFB]"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
