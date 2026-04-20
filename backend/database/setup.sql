-- setup.sql: Creación de tablas y disparadores para sincronización automática
-- NOTA: Se asume que las tablas 'products', 'categories' y 'suppliers' existen o se crearán aquí.

-- 1. Crear tabla CATEGORIES si no existe
CREATE TABLE IF NOT EXISTS categories (
    nombre VARCHAR(100) PRIMARY KEY,
    total_productos INTEGER DEFAULT 0,
    valor_inventario DECIMAL(14, 2) DEFAULT 0
);

-- 2. Crear tabla SUPPLIERS si no existe
CREATE TABLE IF NOT EXISTS suppliers (
    nombre VARCHAR(100) PRIMARY KEY,
    productos_activos INTEGER DEFAULT 0
);

-- 3. Crear tabla PRODUCTS si no existe
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100) NOT NULL REFERENCES categories(nombre) ON UPDATE CASCADE ON DELETE CASCADE,
    precio_compra DECIMAL(12, 2) NOT NULL DEFAULT 0,
    precio_venta DECIMAL(12, 2) NOT NULL DEFAULT 0,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 0,
    proveedor VARCHAR(100) NOT NULL REFERENCES suppliers(nombre) ON UPDATE CASCADE ON DELETE CASCADE,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_ultima_actualizacion DATE DEFAULT CURRENT_DATE
);

-- 4. Función y disparador para CATEGORÍAS
CREATE OR REPLACE FUNCTION sync_categories_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se inserta o actualiza, recalcular categorías afectadas
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE categories
        SET total_productos = (SELECT COUNT(*) FROM products WHERE categoria = NEW.categoria),
            valor_inventario = (SELECT COALESCE(SUM(stock_actual * precio_compra), 0) FROM products WHERE categoria = NEW.categoria)
        WHERE nombre = NEW.categoria;
        
        -- Si cambió la categoría, actualizar la antigua también
        IF (TG_OP = 'UPDATE' AND OLD.categoria <> NEW.categoria) THEN
            UPDATE categories
            SET total_productos = (SELECT COUNT(*) FROM products WHERE categoria = OLD.categoria),
                valor_inventario = (SELECT COALESCE(SUM(stock_actual * precio_compra), 0) FROM products WHERE categoria = OLD.categoria)
            WHERE nombre = OLD.categoria;
        END IF;
    END IF;

    -- Si se elimina, recalcular categoría antigua
    IF (TG_OP = 'DELETE') THEN
        UPDATE categories
        SET total_productos = (SELECT COUNT(*) FROM products WHERE categoria = OLD.categoria),
            valor_inventario = (SELECT COALESCE(SUM(stock_actual * precio_compra), 0) FROM products WHERE categoria = OLD.categoria)
        WHERE nombre = OLD.categoria;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_categories ON products;
CREATE TRIGGER trg_sync_categories
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION sync_categories_stats();

-- 5. Función y disparador para PROVEEDORES
CREATE OR REPLACE FUNCTION sync_suppliers_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se inserta o actualiza, recalcular proveedores afectados
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE suppliers
        SET productos_activos = (SELECT COUNT(*) FROM products WHERE proveedor = NEW.proveedor)
        WHERE nombre = NEW.proveedor;
        
        -- Si cambió el proveedor, actualizar el antiguo también
        IF (TG_OP = 'UPDATE' AND OLD.proveedor <> NEW.proveedor) THEN
            UPDATE suppliers
            SET productos_activos = (SELECT COUNT(*) FROM products WHERE proveedor = OLD.proveedor)
            WHERE nombre = OLD.proveedor;
        END IF;
    END IF;

    -- Si se elimina, recalcular proveedor antiguo
    IF (TG_OP = 'DELETE') THEN
        UPDATE suppliers
        SET productos_activos = (SELECT COUNT(*) FROM products WHERE proveedor = OLD.proveedor)
        WHERE nombre = OLD.proveedor;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_suppliers ON products;
CREATE TRIGGER trg_sync_suppliers
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION sync_suppliers_stats();
