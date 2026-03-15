import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productoSchema, toggleDisponibleSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = productoSchema.parse(body);

    const slug = generateSlug(validatedData.nombre);

    // Verificar si el slug ya existe en otro producto
    const existing = await prisma.producto.findFirst({
      where: { slug, NOT: { id: parseInt(id) } },
    });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        ...validatedData,
        slug: finalSlug,
      },
    });

    return NextResponse.json(producto);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { disponible } = toggleDisponibleSchema.parse(body);

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { disponible },
    });

    return NextResponse.json(producto);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el estado del producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Producto eliminado exitosamente" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
