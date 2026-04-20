-- seeds.sql: Poblado de datos de muestra para demostración del sistema

-- 1. Insertar categorías de muestra
INSERT INTO categories (nombre, total_productos, valor_inventario) VALUES
('Electrónica', 0, 0),
('Hogar', 0, 0),
('Alimentos y Bebidas', 0, 0),
('Herramientas', 0, 0),
('Ropa', 0, 0)
ON CONFLICT (nombre) DO NOTHING;

-- 2. Insertar proveedores de muestra
INSERT INTO suppliers (nombre, productos_activos) VALUES
('Tech-Connect S.A.', 0),
('Hogar Moderno S.L.', 0),
('Distribuidora Global', 0),
('Suministros Industriales', 0),
('Moda Express', 0)
ON CONFLICT (nombre) DO NOTHING;

-- 3. Insertar productos de muestra
INSERT INTO products (sku, nombre, descripcion, categoria, precio_compra, precio_venta, stock_actual, stock_minimo, proveedor) VALUES
('TEC-001', 'Monitor LED 24"', 'Monitor Full HD con panel IPS y tasa de refresco de 75Hz', 'Electrónica', 120.50, 185.00, 25, 5, 'Tech-Connect S.A.'),
('TEC-002', 'Teclado Mecánico RGB', 'Teclado mecánico con switches rojos y retroiluminación RGB', 'Electrónica', 45.00, 89.90, 12, 5, 'Tech-Connect S.A.'),
('TEC-003', 'Mouse Inalámbrico', 'Mouse ergonómico con sensor óptico de alta precisión', 'Electrónica', 15.00, 35.00, 40, 10, 'Tech-Connect S.A.'),
('HOG-101', 'Cafetera Programable', 'Cafetera automática con capacidad para 12 tazas y filtro permanente', 'Hogar', 35.00, 65.00, 8, 3, 'Hogar Moderno S.L.'),
('HOG-102', 'Juego de Sartenes (3 pzas)', 'Set de sartenes antiadherentes de aluminio forjado', 'Hogar', 40.00, 79.00, 15, 5, 'Hogar Moderno S.L.'),
('ALI-201', 'Arroz Integral 1kg', 'Arroz integral de grano largo, empaque sellado al vacío', 'Alimentos y Bebidas', 1.20, 2.50, 150, 50, 'Distribuidora Global'),
('ALI-202', 'Aceite de Oliva 500ml', 'Aceite de oliva virgen extra prensado en frío', 'Alimentos y Bebidas', 4.50, 9.50, 60, 20, 'Distribuidora Global'),
('HER-301', 'Taladro Inalámbrico 18V', 'Taladro percutor con 2 baterías de litio y cargador rápido', 'Herramientas', 85.00, 149.00, 5, 2, 'Suministros Industriales'),
('HER-302', 'Caja de Herramientas (50 pzas)', 'Kit completo de herramientas manuales en estuche rígido', 'Herramientas', 25.00, 49.90, 10, 3, 'Suministros Industriales'),
('ROP-401', 'Camiseta Algodón XL', 'Camiseta de algodón pima color blanco, talla XL', 'Ropa', 8.00, 18.00, 45, 10, 'Moda Express'),
('ROP-402', 'Pantalón Jean Clásico', 'Pantalón de mezclilla resistente para hombre, talla 32', 'Ropa', 15.00, 35.00, 30, 8, 'Moda Express'),
-- Productos con bajo stock para probar alertas
('TEC-004', 'Webcam 4K Ultra HD', 'Cámara web profesional para streaming y videoconferencias', 'Electrónica', 75.00, 120.00, 2, 5, 'Tech-Connect S.A.'),
('HOG-103', 'Aspiradora Robot', 'Aspiradora inteligente con navegación láser y mapeo de casa', 'Hogar', 180.00, 299.00, 1, 3, 'Hogar Moderno S.L.'),
('HER-303', 'Sierra Circular 1500W', 'Sierra circular de alto rendimiento para cortes precisos en madera', 'Herramientas', 65.00, 110.00, 2, 4, 'Suministros Industriales');
