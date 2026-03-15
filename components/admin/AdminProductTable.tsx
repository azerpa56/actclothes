"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Toggle from "@/components/ui/Toggle";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type ProductoSerializado = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  imagen: string;
  imagenes: string[];
  disponible: boolean;
  categoria: string | null;
  tallas: string[];
  creadoEn: Date;
  actualizadoEn: Date;
};

interface AdminProductTableProps {
  initialProductos: ProductoSerializado[];
}

export default function AdminProductTable({
  initialProductos,
}: AdminProductTableProps) {
  const [productos, setProductos] = useState<ProductoSerializado[]>(initialProductos);
  const [search, setSearch] = useState("");
  const [filterDisponible, setFilterDisponible] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filtrar localmente
  const filtered = productos.filter((p) => {
    const matchSearch =
      !search || p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchDisp =
      filterDisponible === ""
        ? true
        : filterDisponible === "true"
        ? p.disponible
        : !p.disponible;
    return matchSearch && matchDisp;
  });

  // Toggle disponible con optimistic update
  const handleToggle = useCallback(
    async (id: number, disponible: boolean) => {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, disponible } : p))
      );

      try {
        await fetch(`/api/productos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disponible }),
        });
      } catch {
        // Revertir en caso de error
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, disponible: !disponible } : p))
        );
      }
    },
    []
  );

  // Eliminar producto
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/productos/${deleteId}`, { method: "DELETE" });
      setProductos((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch {
      // error silencioso, el modal se cierra igual
    } finally {
      setDeleting(false);
    }
  }, [deleteId]);

  return (
    <div className="bg-white border border-neutral-200">
      {/* Cabecera tabla con filtros */}
      <div className="px-5 py-4 border-b border-neutral-100 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black w-52"
        />
        <select
          value={filterDisponible}
          onChange={(e) => setFilterDisponible(e.target.value)}
          className="px-3 py-1.5 text-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Todos los estados</option>
          <option value="true">Disponibles</option>
          <option value="false">Agotados</option>
        </select>
        <span className="text-xs text-neutral-400 ml-auto">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-xs text-neutral-500 font-medium uppercase tracking-widest px-5 py-3 w-16">
                Img
              </th>
              <th className="text-left text-xs text-neutral-500 font-medium uppercase tracking-widest px-5 py-3">
                Nombre
              </th>
              <th className="text-left text-xs text-neutral-500 font-medium uppercase tracking-widest px-5 py-3 hidden sm:table-cell">
                Categoría
              </th>
              <th className="text-left text-xs text-neutral-500 font-medium uppercase tracking-widest px-5 py-3">
                Precio
              </th>
              <th className="text-left text-xs text-neutral-500 font-medium uppercase tracking-widest px-5 py-3">
                Disponible
              </th>
              <th className="text-left text-xs text-neutral-500 font-medium uppercase tracking-widest px-5 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-neutral-400"
                >
                  No hay productos.
                </td>
              </tr>
            ) : (
              filtered.map((producto) => {
                const precio = producto.precio;
                return (
                  <tr key={producto.id} className="hover:bg-neutral-50">
                    {/* Imagen */}
                    <td className="px-5 py-3">
                      <div className="relative w-12 h-14 bg-neutral-100 overflow-hidden">
                        <Image
                          src={producto.imagen}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="px-5 py-3">
                      <p className="font-medium text-neutral-900 truncate max-w-[180px]">
                        {producto.nombre}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        #{producto.id}
                      </p>
                    </td>

                    {/* Categoría */}
                    <td className="px-5 py-3 hidden sm:table-cell text-neutral-500">
                      {producto.categoria || "—"}
                    </td>

                    {/* Precio */}
                    <td className="px-5 py-3 font-medium text-neutral-900">
                      ${precio.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Toggle */}
                    <td className="px-5 py-3">
                      <Toggle
                        checked={producto.disponible}
                        onChange={(val) => handleToggle(producto.id, val)}
                      />
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/productos/${producto.id}/editar`}
                          className="text-xs text-neutral-600 hover:text-black underline transition-colors"
                        >
                          Editar
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(producto.id)}
                          className="text-xs text-red-500 hover:text-red-700 px-0"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal eliminar */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        description="Esta acción no se puede deshacer. ¿Estás seguro que querés eliminar este producto del catálogo?"
        confirmText="Eliminar"
        loading={deleting}
      />
    </div>
  );
}
