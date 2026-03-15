import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const config = await prisma.configSitio.findUnique({ where: { id: 1 } });
  const logoUrl = config?.logoUrl ?? "/logo1.jpeg";

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center">
          <Image
            src={logoUrl}
            alt="ACT Clothes"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
            unoptimized
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-black transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/nosotros"
            className="text-sm text-neutral-600 hover:text-black transition-colors"
          >
            Nosotros
          </Link>
        </div>
      </nav>
    </header>
  );
}
