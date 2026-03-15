import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear administrador por defecto
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@actclothes.com" },
    update: {},
    create: {
      email: "admin@actclothes.com",
      password: hashedPassword,
    },
  });

  console.log("✅ Administrador creado: admin@actclothes.com / admin123");

  // Crear 6 productos de ejemplo
  const productos = [
    {
      nombre: "Camiseta Esencial Blanca",
      slug: "camiseta-esencial-blanca",
      descripcion:
        "Camiseta de algodón pima de alta calidad. Corte oversize con cuello redondo. La base perfecta para cualquier outfit minimalista.",
      precio: 29999,
      imagen: "/uploads/camiseta-blanca.jpg",
      disponible: true,
      categoria: "Camisetas",
      tallas: ["XS", "S", "M", "L", "XL"],
    },
    {
      nombre: "Pantalón Cargo Negro",
      slug: "pantalon-cargo-negro",
      descripcion:
        "Pantalón cargo con múltiples bolsillos. Confeccionado en sarga de algodón resistente. Ajuste relajado para máxima comodidad.",
      precio: 64999,
      imagen: "/uploads/pantalon-cargo.jpg",
      disponible: true,
      categoria: "Pantalones",
      tallas: ["S", "M", "L", "XL"],
    },
    {
      nombre: "Hoodie Urbano Gris",
      slug: "hoodie-urbano-gris",
      descripcion:
        "Sudadera con capucha en fleece de 340g. Interior suave y abrigado. Bolsillo canguro frontal y cordón ajustable.",
      precio: 79990,
      imagen: "/uploads/hoodie-gris.jpg",
      disponible: true,
      categoria: "Buzos",
      tallas: ["S", "M", "L", "XL", "XXL"],
    },
    {
      nombre: "Vestido Minimal Negro",
      slug: "vestido-minimal-negro",
      descripcion:
        "Vestido de largo midi con silueta A-line. Tela crêpe de poliéster de alta gama. Ideal para ocasiones formales y casuales.",
      precio: 89900,
      imagen: "/uploads/vestido-negro.jpg",
      disponible: true,
      categoria: "Vestidos",
      tallas: ["XS", "S", "M", "L"],
    },
    {
      nombre: "Jeans Slim Azul Oscuro",
      slug: "jeans-slim-azul-oscuro",
      descripcion:
        "Jean slim fit en denim stretch 98% algodón. Lavado oscuro premium. Cinco bolsillos y cierre YKK.",
      precio: 74999,
      imagen: "/uploads/jeans-slim.jpg",
      disponible: false,
      categoria: "Pantalones",
      tallas: ["28", "30", "32", "34", "36"],
    },
    {
      nombre: "Campera Oversize Beige",
      slug: "campera-oversize-beige",
      descripcion:
        "Campera de gabardina con corte oversize. Cierre oculto y bolsillos con solapa. El outerwear esencial de temporada.",
      precio: 119990,
      imagen: "/uploads/campera-beige.jpg",
      disponible: true,
      categoria: "Camperas",
      tallas: ["S", "M", "L"],
    },
  ];

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { slug: producto.slug },
      update: {},
      create: producto,
    });
  }

  console.log(`✅ ${productos.length} productos creados exitosamente`);
  console.log("🎉 Seed completado!");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
