import Link from "next/link";
import Image from "next/image";


interface ProductCardProps {
  id: number;
  nombre: string;
  slug: string;
  precio: number | string | { toString(): string };
  imagen: string;
  disponible: boolean;
  categoria?: string | null;
}

export default function ProductCard({
  nombre,
  slug,
  precio,
  imagen,
  disponible,
  categoria,
}: ProductCardProps) {
  const precioNum =
    typeof precio === "object" ? Number(precio.toString()) : Number(precio);

  return (
    <Link href={`/productos/${slug}`} className="group block">
      <article
        className={`relative ${!disponible ? "opacity-60" : ""}`}
      >
        {/* Imagen */}
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
          <Image
            src={imagen}
            alt={nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {!disponible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black text-white text-xs font-semibold px-3 py-1 uppercase tracking-widest">
                Agotado
              </span>
            </div>
          )}
          {categoria && (
            <span className="absolute top-2 left-2 bg-white text-neutral-700 text-xs px-2 py-0.5 border border-neutral-200">
              {categoria}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-neutral-900 leading-snug group-hover:underline">
            {nombre}
          </h3>
          <span className="text-sm text-neutral-900 font-semibold whitespace-nowrap">
            ${precioNum.toLocaleString("es-AR")}
          </span>
        </div>
      </article>
    </Link>
  );
}
