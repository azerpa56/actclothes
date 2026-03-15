import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CuentaForm from "@/components/admin/CuentaForm";

export default async function CuentaPage() {
  const session = await getServerSession(authOptions);
  const currentEmail = session?.user?.email ?? "";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Mi cuenta</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Cambiá el correo o la contraseña del panel administrador
        </p>
      </div>
      <CuentaForm currentEmail={currentEmail} />
    </div>
  );
}
