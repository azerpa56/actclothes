import { prisma } from "@/lib/prisma";
import ConfiguracionForm from "@/components/admin/ConfiguracionForm";

export default async function ConfiguracionPage() {
  const config = await prisma.configSitio.findUnique({ where: { id: 1 } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Configuración del sitio</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Actualizá el logo y el contenido de la página Nosotros
        </p>
      </div>
      <ConfiguracionForm initialConfig={config ?? {}} />
    </div>
  );
}
