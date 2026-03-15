"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  imagen: string;
  imagenes: string[];
  nombre: string;
}

export default function ProductGallery({ imagen, imagenes, nombre }: Props) {
  const allImages = [imagen, ...imagenes].filter(Boolean);
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        <Image
          src={allImages[active]}
          alt={`${nombre} - foto ${active + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                active === i ? "border-black" : "border-transparent hover:border-neutral-300"
              }`}
            >
              <Image
                src={src}
                alt={`${nombre} miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
