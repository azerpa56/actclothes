import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newEmail, newPassword } = body as {
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
  };

  if (!currentPassword) {
    return NextResponse.json(
      { error: "Debés ingresar tu contraseña actual" },
      { status: 400 }
    );
  }

  if (!newEmail && !newPassword) {
    return NextResponse.json(
      { error: "Ingresá al menos un campo a actualizar" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { email: session.user.email },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin no encontrado" }, { status: 404 });
  }

  const passwordMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "La contraseña actual es incorrecta" },
      { status: 400 }
    );
  }

  const updateData: { email?: string; password?: string } = {};

  if (newEmail && newEmail !== admin.email) {
    const exists = await prisma.admin.findUnique({ where: { email: newEmail } });
    if (exists) {
      return NextResponse.json(
        { error: "Ese correo ya está en uso" },
        { status: 400 }
      );
    }
    updateData.email = newEmail;
  }

  if (newPassword) {
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ message: "Sin cambios" });
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: updateData,
  });

  return NextResponse.json({
    message: "Credenciales actualizadas. Por seguridad, cerrá sesión y volvé a ingresar.",
    emailChanged: !!updateData.email,
  });
}
