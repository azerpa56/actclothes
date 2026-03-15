import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminProductTable from "@/components/admin/AdminProductTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const productosRaw = await prisma.producto.findMany({
    orderBy: { creadoEn: "desc" },
  });

  const productos = productosRaw.map((p) => ({
    ...p,
    precio: p.precio.toNumber(),
  }));

  const total = productos.length;
  const disponibles = productos.filter((p: { disponible: boolean }) => p.disponible).length;
  const agotados = total - disponibles;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Gestioná el catálogo de ACT Clothes
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <span>＋</span> Nuevo Producto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total productos", value: total },
          { label: "Disponibles", value: disponibles },
          { label: "Agotados", value: agotados },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-neutral-200 p-5"
          >
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <AdminProductTable initialProductos={productos} />
    </div>
  );
}
