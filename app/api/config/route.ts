import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CONFIG_ID = 1;

export async function GET() {
  const config = await prisma.configSitio.findUnique({ where: { id: CONFIG_ID } });
  return NextResponse.json(config ?? { id: CONFIG_ID });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { logoUrl, nosotrosHistoria1, nosotrosHistoria2, nosotrosFilosofia, contactoEmail } = body;

  const config = await prisma.configSitio.upsert({
    where: { id: CONFIG_ID },
    update: { logoUrl, nosotrosHistoria1, nosotrosHistoria2, nosotrosFilosofia, contactoEmail },
    create: { id: CONFIG_ID, logoUrl, nosotrosHistoria1, nosotrosHistoria2, nosotrosFilosofia, contactoEmail },
  });

  return NextResponse.json(config);
}
