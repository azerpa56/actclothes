import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductoForm from "@/components/admin/ProductoForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id: parseInt(id) },
  });

  if (!producto) notFound();

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
        <Link href="/admin" className="hover:text-black transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-neutral-900">Editar: {producto.nombre}</span>
      </nav>

      <h1 className="text-2xl font-bold text-neutral-900 mb-8">
        Editar producto
      </h1>

      <ProductoForm producto={producto} />
    </div>
  );
}
