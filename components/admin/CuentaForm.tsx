"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface Props {
  currentEmail: string;
}

export default function CuentaForm({ currentEmail }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas nuevas no coinciden" });
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setMessage({ type: "error", text: "La contraseña nueva debe tener al menos 8 caracteres" });
      return;
    }

    const hasEmailChange = newEmail.trim() !== currentEmail;
    const hasPasswordChange = !!newPassword;

    if (!hasEmailChange && !hasPasswordChange) {
      setMessage({ type: "error", text: "No realizaste ningún cambio" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/credenciales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail: hasEmailChange ? newEmail.trim() : undefined,
          newPassword: hasPasswordChange ? newPassword : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Error desconocido" });
        return;
      }

      setMessage({ type: "success", text: data.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Error de red. Intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
      {/* Contraseña actual */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">Verificación</h2>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Contraseña actual <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Requerida para confirmar cualquier cambio
          </p>
        </div>
      </div>

      {/* Cambiar correo */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">Correo electrónico</h2>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Nuevo correo
          </label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">Nueva contraseña</h2>
        <p className="text-xs text-neutral-500">
          Dejá en blanco si no querés cambiar la contraseña
        </p>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Confirmá la nueva contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí la contraseña"
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Mensaje de respuesta */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
          {message.type === "success" && (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-3 underline font-medium"
            >
              Cerrar sesión ahora
            </button>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !currentPassword}
        className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
