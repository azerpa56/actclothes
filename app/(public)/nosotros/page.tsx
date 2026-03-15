import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nosotros — ACT Clothes",
  description:
    "Conocé la historia detrás de ACT Clothes, una marca de ropa minimalista de Argentina.",
};

const DEFAULTS = {
  historia1:
    "ACT Clothes nació de una idea simple: que la ropa no tiene que ser complicada. Somos una marca argentina fundada en 2021 con la convicción de que las prendas esenciales son las que más valor tienen.",
  historia2:
    "Creamos colecciones pequeñas y cuidadas, pensadas para durar. Nuestro proceso comienza con la selección de telas de alta calidad y termina en un producto que se lleva con la misma facilidad un lunes de trabajo que un sábado casual.",
  filosofia: "El minimalismo no es tener menos. Es hacer espacio para lo que importa.",
  email: "hola@actclothes.com",
};

export default async function NosotrosPage() {
  const config = await prisma.configSitio.findUnique({ where: { id: 1 } });

  const historia1 = config?.nosotrosHistoria1 || DEFAULTS.historia1;
  const historia2 = config?.nosotrosHistoria2 || DEFAULTS.historia2;
  const filosofia = config?.nosotrosFilosofia || DEFAULTS.filosofia;
  const email = config?.contactoEmail || DEFAULTS.email;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Encabezado */}
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-6">
        Quiénes somos
      </h1>
      <div className="w-16 h-px bg-black mb-10" />

      {/* Historia */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-black mb-4 uppercase tracking-widest text-sm">
          Nuestra historia
        </h2>
        <p className="text-neutral-600 leading-relaxed mb-4">{historia1}</p>
        <p className="text-neutral-600 leading-relaxed">{historia2}</p>
      </section>

      {/* Filosofía */}
      <section className="mb-12 bg-neutral-50 p-8">
        <h2 className="text-sm font-semibold text-black mb-4 uppercase tracking-widest">
          Nuestra filosofía
        </h2>
        <blockquote className="text-xl sm:text-2xl font-light text-neutral-800 leading-relaxed italic">
          &ldquo;{filosofia}&rdquo;
        </blockquote>
      </section>

      {/* Valores */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-black mb-6 uppercase tracking-widest">
          Nuestros pilares
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Calidad",
              description:
                "Usamos telas seleccionadas y procesos de confección controlados para garantizar durabilidad en cada prenda.",
            },
            {
              title: "Simplicidad",
              description:
                "Diseños limpios, sin excesos. La elegancia está en los detalles que no se ven a primera vista.",
            },
            {
              title: "Consciencia",
              description:
                "Producciones en lotes pequeños para evitar el desperdicio. Preferimos calidad sobre cantidad.",
            },
          ].map((pilar) => (
            <div key={pilar.title} className="border-t border-neutral-200 pt-4">
              <h3 className="font-semibold text-black mb-2">{pilar.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {pilar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section>
        <h2 className="text-sm font-semibold text-black mb-4 uppercase tracking-widest">
          Contacto
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          ¿Tenés alguna consulta? Escribinos a{" "}
          <a
            href={`mailto:${email}`}
            className="text-black underline hover:no-underline"
          >
            {email}
          </a>{" "}
          o encontranos en nuestras redes sociales.
        </p>
      </section>
    </div>
  );
}
