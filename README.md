# Sistema de Inventario y E-commerce Senior

Este proyecto es una plataforma de e-commerce production-ready construida con un stack moderno y arquitectura senior.

## Stack Tecnológico

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express 4.19
- **ORM:** Prisma 5+ con PostgreSQL 16+
- **Validación:** Zod
- **Autenticación:** JWT + bcrypt (RBAC implementado)
- **Reportes:** PDFKit

### Frontend
- **Framework:** React 18+ con Vite 5
- **Estado:** Zustand + TanStack Query v5
- **UI:** shadcn/ui + Tailwind CSS 3+
- **Formularios:** React Hook Form + Zod
- **Gráficos:** Recharts

## Estructura del Proyecto
```text
/
├── backend/            # API RESTful con Prisma
├── frontend/           # SPA con React y Tailwind
├── package.json        # Configuración del Monorepo
└── README.md
```

## Configuración Inicial

1. **Instalar dependencias:**
   ```bash
   npm run install:all
   ```

2. **Configurar variables de entorno:**
   - Copia `backend/.env.example` a `backend/.env` y ajusta tu `DATABASE_URL`.

3. **Preparar la Base de Datos:**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## Roles del Sistema
- **Administrador:** Acceso total.
- **Cliente:** Navegar y comprar.
- **Gerente de Ventas:** Dashboard y reportes.
- **Gerente de Inventario:** CRUD productos y stock.
- **Vendedor:** Gestión básica de órdenes.

## API Versionada
La API se encuentra en `/api/v1/`.
- Auth: `/api/v1/auth/login`
- Productos: `/api/v1/productos`
- Carrito: `/api/v1/carrito`
- Órdenes: `/api/v1/ordenes`
- Inventario: `/api/v1/inventario`
- Reportes: `/api/v1/reportes`
