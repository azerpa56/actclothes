import Link from "next/link";
import ProductoForm from "@/components/admin/ProductoForm";

export default function NuevoProductoPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
        <Link href="/admin" className="hover:text-black transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-neutral-900">Nuevo Producto</span>
      </nav>

      <h1 className="text-2xl font-bold text-neutral-900 mb-8">
        Crear nuevo producto
      </h1>

      <ProductoForm />
    </div>
  );
}
