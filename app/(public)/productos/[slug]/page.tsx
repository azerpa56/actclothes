import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import ProductGallery from "@/components/public/ProductGallery";
import WhatsAppBuyButton from "@/components/public/WhatsAppBuyButton";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProducto(slug: string) {
  return await prisma.producto.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: `${producto.nombre} — ACT Clothes`,
    description: producto.descripcion,
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const producto = await getProducto(slug);

  if (!producto) notFound();

  const precioNum = Number(producto.precio.toString());

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">
          Catálogo
        </Link>
        <span>/</span>
        {producto.categoria && (
          <>
            <Link
              href={`/?categoria=${producto.categoria}`}
              className="hover:text-black transition-colors"
            >
              {producto.categoria}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-neutral-700">{producto.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Galería */}
        <ProductGallery
          imagen={producto.imagen}
          imagenes={(producto as typeof producto & { imagenes: string[] }).imagenes ?? []}
          nombre={producto.nombre}
        />

        {/* Detalles */}
        <div className="flex flex-col justify-start py-2">
          {producto.categoria && (
            <span className="text-xs text-neutral-500 uppercase tracking-widest mb-3">
              {producto.categoria}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
            {producto.nombre}
          </h1>

          <p className="text-2xl font-semibold text-black mb-6">
            ${precioNum.toLocaleString("es-AR")}
          </p>

          <p className="text-neutral-600 text-sm leading-relaxed mb-8">
            {producto.descripcion}
          </p>

          {producto.disponible ? (
            <WhatsAppBuyButton
              productName={producto.nombre}
              precio={precioNum}
              tallas={producto.tallas}
            />
          ) : (
            <div className="border border-neutral-200 p-4 text-center">
              <p className="text-sm text-neutral-500">
                Este producto no está disponible en este momento.
              </p>
              <Link
                href="/"
                className="inline-block mt-3 text-sm text-black underline hover:no-underline"
              >
                Ver otros productos
              </Link>
            </div>
          )}

          {/* Tallas disponibles (informativo) */}
          {producto.disponible && producto.tallas.length > 0 && (
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">
                Tallas disponibles
              </p>
              <div className="flex flex-wrap gap-2">
                {producto.tallas.map((talla: string) => (
                  <span
                    key={talla}
                    className="text-xs border border-neutral-200 px-2 py-1 text-neutral-600"
                  >
                    {talla}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
