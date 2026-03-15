# ACT Clothes  Tienda Online de Ropa Minimalista

Plataforma de e-commerce para ACT Clothes, construida con Next.js 14+, TypeScript, PostgreSQL y Prisma.

## Stack Tecnologico

- **Framework:** Next.js 14+ con App Router
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticacion:** NextAuth.js (panel admin)
- **Estilos:** Tailwind CSS
- **Subida de imagenes:** Almacenamiento local (/public/uploads)
- **Validacion:** Zod + React Hook Form

---

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- npm

---

## Instalacion

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
DATABASE_URL="postgresql://usuario:contrasena@localhost:5432/act_clothes"
NEXTAUTH_SECRET="un-secreto-muy-largo-y-aleatorio"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configurar la base de datos

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

---

## Credenciales del admin por defecto

- **Email:** admin@actclothes.com
- **Contrasena:** admin123

---

## Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run db:migrate` | Aplicar migraciones |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:seed` | Poblar base de datos |
| `npm run db:studio` | Abrir Prisma Studio |

---

## API Reference

| Metodo | Endpoint | Descripcion | Auth |
|--------|----------|-------------|------|
| GET | `/api/productos` | Lista productos | Publico |
| POST | `/api/productos` | Crear producto | Admin |
| GET | `/api/productos/:id` | Obtener producto | Publico |
| PUT | `/api/productos/:id` | Editar producto | Admin |
| PATCH | `/api/productos/:id` | Cambiar disponibilidad | Admin |
| DELETE | `/api/productos/:id` | Eliminar producto | Admin |
| POST | `/api/upload` | Subir imagen | Admin |
