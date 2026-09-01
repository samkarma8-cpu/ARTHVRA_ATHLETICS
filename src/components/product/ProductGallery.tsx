"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: { url: string; alt: string | null }[] }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ url: "/product-placeholder.svg", alt: null }];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
        <Image
          src={list[active].url}
          alt={list[active].alt || "Product image"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-mist border",
                i === active ? "border-ink" : "border-line"
              )}
            >
              <Image src={img.url} alt={img.alt || ""} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
