import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/public/ProductCard";
import Filters from "@/components/public/Filters";

interface SearchParams {
  search?: string;
  categoria?: string;
  disponible?: string;
}

async function getProductos(searchParams: SearchParams) {
  const where: Record<string, unknown> = {};

  if (searchParams.search) {
    where.OR = [
      {
        nombre: { contains: searchParams.search, mode: "insensitive" },
      },
      {
        descripcion: { contains: searchParams.search, mode: "insensitive" },
      },
    ];
  }

  if (searchParams.categoria) {
    where.categoria = {
      equals: searchParams.categoria,
      mode: "insensitive",
    };
  }

  if (searchParams.disponible !== undefined && searchParams.disponible !== "") {
    where.disponible = searchParams.disponible === "true";
  }

  return await prisma.producto.findMany({
    where,
    orderBy: { creadoEn: "desc" },
  });
}

async function getCategorias() {
  const result = await prisma.producto.findMany({
    select: { categoria: true },
    distinct: ["categoria"],
    where: { categoria: { not: null } },
  });
  return result.map((r) => r.categoria as string);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [productos, categorias] = await Promise.all([
    getProductos(params),
    getCategorias(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="mb-10 sm:mb-14">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-3">
          Colección
        </h1>
        <p className="text-neutral-500 text-base sm:text-lg max-w-xl">
          Prendas esenciales para quienes prefieren lo que perdura.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <Suspense fallback={null}>
          <Filters categorias={categorias} />
        </Suspense>
      </div>

      {/* Resultados */}
      {productos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-400 text-lg">
            No se encontraron productos.
          </p>
          <p className="text-neutral-300 text-sm mt-1">
            Probá con otros filtros.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-400 mb-6">
            {productos.length} producto{productos.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                slug={producto.slug}
                precio={producto.precio}
                imagen={producto.imagen}
                disponible={producto.disponible}
                categoria={producto.categoria}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
