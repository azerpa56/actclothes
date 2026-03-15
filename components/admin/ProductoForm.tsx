"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import type { Producto } from "@/app/generated/prisma/client";
import { productoSchema, ProductoFormData } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const TALLAS_DISPONIBLES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];
const CATEGORIAS = ["Camisetas", "Pantalones", "Vestidos", "Buzos", "Camperas", "Accesorios"];

interface ProductoFormProps {
  producto?: Producto;
}

export default function ProductoForm({ producto }: ProductoFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(producto?.imagen || "");
  const [extraPreviews, setExtraPreviews] = useState<string[]>(
    (producto as (typeof producto & { imagenes?: string[] }))?.imagenes ?? []
  );
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: producto?.nombre || "",
      descripcion: producto?.descripcion || "",
      precio: producto ? Number(producto.precio.toString()) : undefined,
      imagen: producto?.imagen || "",
      imagenes: (producto as (typeof producto & { imagenes?: string[] }))?.imagenes ?? [],
      disponible: producto?.disponible ?? true,
      categoria: producto?.categoria || "",
      tallas: producto?.tallas || [],
    },
  });

  const selectedTallas = watch("tallas") || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");

      const data = await res.json() as { url: string };
      setValue("imagen", data.url, { shouldValidate: true });
      setPreviewUrl(data.url);
    } catch {
      setSubmitError("Error al subir la imagen. Intentá de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleExtraFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (extraPreviews.length >= 3) return;

    setUploadingExtra(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Error al subir la imagen");
      const data = await res.json() as { url: string };
      const newExtras = [...extraPreviews, data.url];
      setExtraPreviews(newExtras);
      setValue("imagenes", newExtras, { shouldValidate: true });
    } catch {
      setSubmitError("Error al subir imagen adicional.");
    } finally {
      setUploadingExtra(false);
      if (extraFileInputRef.current) extraFileInputRef.current.value = "";
    }
  };

  const removeExtraImage = (index: number) => {
    const newExtras = extraPreviews.filter((_, i) => i !== index);
    setExtraPreviews(newExtras);
    setValue("imagenes", newExtras);
  };

  const toggleTalla = (talla: string) => {
    const current = selectedTallas;
    if (current.includes(talla)) {
      setValue(
        "tallas",
        current.filter((t) => t !== talla),
        { shouldValidate: true }
      );
    } else {
      setValue("tallas", [...current, talla], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ProductoFormData) => {
    setSubmitError("");
    try {
      const url = producto
        ? `/api/productos/${producto.id}`
        : "/api/productos";
      const method = producto ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error || "Error al guardar el producto");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Error al guardar el producto"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      {/* Nombre */}
      <Input
        id="nombre"
        label="Nombre del producto *"
        placeholder="Ej: Camiseta Esencial Blanca"
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      {/* Precio */}
      <Input
        id="precio"
        label="Precio (ARS) *"
        type="number"
        step="0.01"
        min="0"
        placeholder="29999"
        error={errors.precio?.message}
        {...register("precio", { valueAsNumber: true })}
      />

      {/* Descripción */}
      <Textarea
        id="descripcion"
        label="Descripción *"
        rows={4}
        placeholder="Descripción detallada del producto..."
        error={errors.descripcion?.message}
        {...register("descripcion")}
      />

      {/* Categoría */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="categoria"
          className="text-sm font-medium text-neutral-900"
        >
          Categoría
        </label>
        <select
          id="categoria"
          className="px-3 py-2 text-sm border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
          {...register("categoria")}
        >
          <option value="">Sin categoría</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tallas */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-neutral-900">Tallas *</p>
        <div className="flex flex-wrap gap-2">
          {TALLAS_DISPONIBLES.map((talla) => (
            <button
              type="button"
              key={talla}
              onClick={() => toggleTalla(talla)}
              className={`min-w-11 h-9 px-3 text-sm border transition-colors ${
                selectedTallas.includes(talla)
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-600"
              }`}
            >
              {talla}
            </button>
          ))}
        </div>
        {errors.tallas && (
          <p className="text-xs text-red-600">{errors.tallas.message}</p>
        )}
      </div>

      {/* Imagen */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-neutral-900">Imagen *</p>
        <div className="flex items-start gap-4">
          {/* Preview */}
          {previewUrl && (
            <div className="relative w-24 h-28 bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Subiendo..." : "Seleccionar imagen"}
            </Button>
            <p className="text-xs text-neutral-400">
              JPG, PNG o WebP. Máx. 5MB.
            </p>
          </div>
        </div>
        <input type="hidden" {...register("imagen")} />
        {errors.imagen && (
          <p className="text-xs text-red-600">{errors.imagen.message}</p>
        )}
      </div>

      {/* Fotos adicionales */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-neutral-900">
          Fotos adicionales{" "}
          <span className="text-neutral-400 font-normal">({extraPreviews.length}/3)</span>
        </p>
        <div className="flex flex-wrap gap-3 items-start">
          {extraPreviews.map((src, i) => (
            <div key={i} className="relative w-24 h-28 bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
              <Image src={src} alt={`Foto extra ${i + 1}`} fill className="object-cover" sizes="96px" unoptimized />
              <button
                type="button"
                onClick={() => removeExtraImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {extraPreviews.length < 3 && (
            <div className="flex flex-col gap-2 justify-end">
              <input
                ref={extraFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleExtraFileChange}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={uploadingExtra}
                onClick={() => extraFileInputRef.current?.click()}
              >
                {uploadingExtra ? "Subiendo..." : "+ Agregar foto"}
              </Button>
              <p className="text-xs text-neutral-400">Máx. 3 fotos adicionales</p>
            </div>
          )}
        </div>
      </div>

      {/* Disponible */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="disponible"
          className="h-4 w-4 border-neutral-300 text-black focus:ring-black"
          {...register("disponible")}
        />
        <label htmlFor="disponible" className="text-sm text-neutral-900">
          Producto disponible
        </label>
      </div>

      {/* Error general */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          {producto ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
