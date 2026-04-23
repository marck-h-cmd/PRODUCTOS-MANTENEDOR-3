-- SQL Script for Initial Setup (Idempotent)
-- Adaptado a PostgreSQL 16+ con convenciones snake_case y prefijos

-- 1. Crear Base de Datos (Si es necesario, ejecutar manualmente o mediante script de despliegue)
-- CREATE DATABASE sistema_inventario;

-- 2. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tablas de Seguridad
CREATE TABLE IF NOT EXISTS seg_roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seg_permisos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seg_rol_permiso (
    rol_id INTEGER REFERENCES seg_roles(id) ON DELETE CASCADE,
    permiso_id INTEGER REFERENCES seg_permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS seg_usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seg_usuario_rol (
    usuario_id INTEGER REFERENCES seg_usuarios(id) ON DELETE CASCADE,
    rol_id INTEGER REFERENCES seg_roles(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

-- 4. Tablas de Catálogo
CREATE TABLE IF NOT EXISTS cat_categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cat_productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion_corta TEXT,
    descripcion_larga TEXT,
    categoria_id INTEGER REFERENCES cat_categorias(id),
    precio_costo DECIMAL(12,2) NOT NULL,
    precio_venta DECIMAL(12,2) NOT NULL,
    precio_oferta DECIMAL(12,2),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inventario
CREATE TABLE IF NOT EXISTS inv_stock_producto (
    producto_id INTEGER PRIMARY KEY REFERENCES cat_productos(id) ON DELETE CASCADE,
    cantidad INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Clientes y Órdenes
CREATE TABLE IF NOT EXISTS cli_clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES seg_usuarios(id),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ord_estados_orden (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS ord_ordenes (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES cli_clientes(id),
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(12,2) NOT NULL,
    impuestos DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    estado_id INTEGER REFERENCES ord_estados_orden(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Datos Semilla (Seed Data)
INSERT INTO seg_roles (nombre, descripcion) VALUES 
('Administrador', 'Acceso total al sistema'),
('Cliente', 'Usuario que realiza compras'),
('Vendedor', 'Gestiona ventas y clientes'),
('Gerente de Inventario', 'Gestiona productos y stock')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO ord_estados_orden (nombre) VALUES 
('Pendiente'), ('Pagado'), ('En Proceso'), ('Enviado'), ('Entregado'), ('Cancelado')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_categorias (nombre) VALUES 
('Electrónica'), ('Hogar'), ('Moda'), ('Deportes')
ON CONFLICT (nombre) DO NOTHING;

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_cat_productos_sku ON cat_productos(sku);
CREATE INDEX IF NOT EXISTS idx_ord_ordenes_cliente ON ord_ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_seg_usuarios_email ON seg_usuarios(email);
