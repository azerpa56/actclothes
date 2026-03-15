import { z } from "zod";

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  precio: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .multipleOf(0.01, "El precio puede tener hasta 2 decimales"),
  imagen: z.string().min(1, "La imagen es requerida"),
  imagenes: z.array(z.string()).max(3, "Máximo 3 fotos adicionales").optional().default([]),
  disponible: z.boolean(),
  categoria: z.string().optional(),
  tallas: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos una talla"),
});

export const productoEditSchema = productoSchema.partial().extend({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const toggleDisponibleSchema = z.object({
  disponible: z.boolean(),
});

export type ProductoFormData = z.infer<typeof productoSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

