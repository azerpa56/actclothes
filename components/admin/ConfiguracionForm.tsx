"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ConfigData {
  logoUrl?: string | null;
  nosotrosHistoria1?: string | null;
  nosotrosHistoria2?: string | null;
  nosotrosFilosofia?: string | null;
  contactoEmail?: string | null;
}

interface Props {
  initialConfig: ConfigData;
}

export default function ConfiguracionForm({ initialConfig }: Props) {
  const [logoUrl, setLogoUrl] = useState(initialConfig.logoUrl ?? "/logo1.jpeg");
  const [historia1, setHistoria1] = useState(
    initialConfig.nosotrosHistoria1 ??
      "ACT Clothes nació de una idea simple: que la ropa no tiene que ser complicada. Somos una marca argentina fundada en 2021 con la convicción de que las prendas esenciales son las que más valor tienen."
  );
  const [historia2, setHistoria2] = useState(
    initialConfig.nosotrosHistoria2 ??
      "Creamos colecciones pequeñas y cuidadas, pensadas para durar. Nuestro proceso comienza con la selección de telas de alta calidad y termina en un producto que se lleva con la misma facilidad un lunes de trabajo que un sábado casual."
  );
  const [filosofia, setFilosofia] = useState(
    initialConfig.nosotrosFilosofia ??
      "El minimalismo no es tener menos. Es hacer espacio para lo que importa."
  );
  const [email, setEmail] = useState(initialConfig.contactoEmail ?? "hola@actclothes.com");

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir imagen");
      setLogoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSavedOk(false);
    setError(null);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl,
          nosotrosHistoria1: historia1,
          nosotrosHistoria2: historia2,
          nosotrosFilosofia: filosofia,
          contactoEmail: email,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al guardar");
      }
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-10">
      {/* Logo */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-4">
          Logo del sitio
        </h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 border border-neutral-200 flex items-center justify-center bg-white overflow-hidden">
            <Image
              src={logoUrl}
              alt="Logo actual"
              width={96}
              height={96}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="px-4 py-2 text-sm border border-neutral-300 hover:border-black transition-colors disabled:opacity-50"
            >
              {uploadingLogo ? "Subiendo..." : "Cambiar logo"}
            </button>
            <p className="text-xs text-neutral-400 mt-2">JPG, PNG o WebP · máx. 5MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-4">
          Página "Nosotros"
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Historia — párrafo 1</label>
            <textarea
              value={historia1}
              onChange={(e) => setHistoria1(e.target.value)}
              rows={4}
              className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Historia — párrafo 2</label>
            <textarea
              value={historia2}
              onChange={(e) => setHistoria2(e.target.value)}
              rows={4}
              className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Frase / filosofía</label>
            <textarea
              value={filosofia}
              onChange={(e) => setFilosofia(e.target.value)}
              rows={3}
              className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-4">
          Contacto
        </h2>
        <div>
          <label className="block text-xs text-neutral-500 mb-1">Email de contacto</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </section>

      {/* Acciones */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {savedOk && (
          <span className="text-sm text-green-600 font-medium">¡Guardado correctamente!</span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
