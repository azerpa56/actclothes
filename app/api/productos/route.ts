import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productoSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoria = searchParams.get("categoria") || "";
    const disponible = searchParams.get("disponible");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoria) {
      where.categoria = { equals: categoria, mode: "insensitive" };
    }

    if (disponible !== null && disponible !== "") {
      where.disponible = disponible === "true";
    }

    const productos = await prisma.producto.findMany({
      where,
      orderBy: { creadoEn: "desc" },
    });

    return NextResponse.json(productos);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productoSchema.parse(body);

    const slug = generateSlug(validatedData.nombre);

    // Verificar slug único
    const existing = await prisma.producto.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const producto = await prisma.producto.create({
      data: {
        ...validatedData,
        slug: finalSlug,
        precio: validatedData.precio,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
