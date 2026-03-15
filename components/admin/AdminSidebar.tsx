"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/productos/nuevo", label: "Nuevo Producto" },
  { href: "/admin/configuracion", label: "Configuración" },
  { href: "/admin/cuenta", label: "Mi Cuenta" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-black text-white flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-neutral-800">
        <Link
          href="/"
          className="text-sm font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          ACT Clothes
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3 px-3">
          Administración
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm rounded transition-colors",
                    isActive
                      ? "bg-white text-black font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
