"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import Input from "@/components/ui/Input";

interface FiltersProps {
  categorias: string[];
}

export default function Filters({ categorias }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoria, setCategoria] = useState(
    searchParams.get("categoria") || ""
  );
  const [disponible, setDisponible] = useState(
    searchParams.get("disponible") || ""
  );

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });
      return current.toString();
    },
    [searchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      startTransition(() => {
        router.push(`${pathname}?${createQueryString({ search: value })}`);
      });
    },
    [router, pathname, createQueryString]
  );

  const handleCategoria = useCallback(
    (value: string) => {
      setCategoria(value);
      startTransition(() => {
        router.push(`${pathname}?${createQueryString({ categoria: value })}`);
      });
    },
    [router, pathname, createQueryString]
  );

  const handleDisponible = useCallback(
    (value: string) => {
      setDisponible(value);
      startTransition(() => {
        router.push(`${pathname}?${createQueryString({ disponible: value })}`);
      });
    },
    [router, pathname, createQueryString]
  );

  const handleClearFilters = () => {
    setSearch("");
    setCategoria("");
    setDisponible("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = search || categoria || disponible;

  return (
    <div className="flex flex-col gap-4">
      {/* Búsqueda */}
      <Input
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />

      {/* Filtros en fila */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Categoría */}
        <select
          value={categoria}
          onChange={(e) => handleCategoria(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Disponibilidad */}
        <select
          value={disponible}
          onChange={(e) => handleDisponible(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Todos</option>
          <option value="true">Disponibles</option>
          <option value="false">Agotados</option>
        </select>

        {/* Limpiar filtros */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-neutral-500 underline hover:text-black transition-colors"
          >
            Limpiar filtros
          </button>
        )}

        {isPending && (
          <span className="text-xs text-neutral-400">Filtrando...</span>
        )}
      </div>
    </div>
  );
}
