"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
  images?: string[];
  intervalMs?: number;
  title?: string;
  text?: string;
};

export default function SimpleAuthPanel({
  images = ["/auth-pages-bg.jpg"],
  intervalMs = 6000,
  title = "Explore What’s Around",
  text = "Delve connects you to reliable businesses for every moment, every need.",
}: Props): JSX.Element {
  const [index, setIndex] = React.useState(0);
  const hasMultiple = images.length > 1;

  React.useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs, hasMultiple]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      {/* Images stacked with fade */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={src}
              alt={title}
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
        <h2 className="font-karma text-[26px] leading-7">{title}</h2>
        <p className="mt-1 max-w-[360px] text-[15px] leading-5 opacity-90">{text}</p>
        {hasMultiple && (
          <div className="mt-4 flex gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === index ? "w-12 bg-primary" : "w-2 bg-[#A48AFB]"}`}
              />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
