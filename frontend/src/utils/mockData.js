export const MOCK_PRODUCTS = [
  { id:1, sku:'LAP-001', nombre:'Laptop HP ProBook 450', descripcion:'Laptop empresarial 15.6" Core i5', categoria:'Electrónica', precio_compra:2200, precio_venta:2800, stock_actual:12, stock_minimo:5, proveedor:'TechDistributor SAC', fecha_creacion:'2024-01-10', fecha_ultima_actualizacion:'2025-03-15' },
  { id:2, sku:'MON-002', nombre:'Monitor LG 24" Full HD', descripcion:'Monitor IPS 24 pulgadas', categoria:'Electrónica', precio_compra:580, precio_venta:750, stock_actual:3, stock_minimo:8, proveedor:'TechDistributor SAC', fecha_creacion:'2024-02-01', fecha_ultima_actualizacion:'2025-03-20' },
  { id:3, sku:'SIL-003', nombre:'Silla Ergonómica Pro', descripcion:'Silla de oficina regulable', categoria:'Mobiliario', precio_compra:450, precio_venta:620, stock_actual:25, stock_minimo:10, proveedor:'OfficeSupplies Perú', fecha_creacion:'2024-01-20', fecha_ultima_actualizacion:'2025-02-10' },
  { id:4, sku:'PAP-004', nombre:'Resma de Papel A4 500h', descripcion:'Papel bond 75gr', categoria:'Papelería', precio_compra:18, precio_venta:25, stock_actual:4, stock_minimo:20, proveedor:'Papelería Central', fecha_creacion:'2024-03-01', fecha_ultima_actualizacion:'2025-04-01' },
  { id:5, sku:'KEY-005', nombre:'Teclado Mecánico Logitech', descripcion:'Teclado inalámbrico MX Keys', categoria:'Electrónica', precio_compra:320, precio_venta:420, stock_actual:18, stock_minimo:6, proveedor:'TechDistributor SAC', fecha_creacion:'2024-02-15', fecha_ultima_actualizacion:'2025-03-05' },
  { id:6, sku:'MES-006', nombre:'Mesa de Escritorio 160cm', descripcion:'Escritorio melamina blanca', categoria:'Mobiliario', precio_compra:380, precio_venta:520, stock_actual:7, stock_minimo:3, proveedor:'OfficeSupplies Perú', fecha_creacion:'2024-01-25', fecha_ultima_actualizacion:'2025-01-30' },
  { id:7, sku:'IMP-007', nombre:'Impresora Epson EcoTank', descripcion:'Impresora multifunción tinta', categoria:'Electrónica', precio_compra:680, precio_venta:890, stock_actual:2, stock_minimo:4, proveedor:'TechDistributor SAC', fecha_creacion:'2024-04-01', fecha_ultima_actualizacion:'2025-04-10' },
  { id:8, sku:'CAF-008', nombre:'Cafetera Industrial 12tz', descripcion:'Cafetera de goteo acero inox', categoria:'Electrodomésticos', precio_compra:220, precio_venta:310, stock_actual:9, stock_minimo:3, proveedor:'HomeGoods SAC', fecha_creacion:'2024-03-20', fecha_ultima_actualizacion:'2025-02-28' },
  { id:9, sku:'BOL-009', nombre:'Bolígrafos BIC x12', descripcion:'Caja de bolígrafos azul', categoria:'Papelería', precio_compra:8, precio_venta:14, stock_actual:1, stock_minimo:15, proveedor:'Papelería Central', fecha_creacion:'2024-02-10', fecha_ultima_actualizacion:'2025-03-18' },
  { id:10,sku:'PRO-010', nombre:'Proyector Epson EB-X51', descripcion:'Proyector 3600 lúmenes XGA', categoria:'Electrónica', precio_compra:1800, precio_venta:2300, stock_actual:5, stock_minimo:2, proveedor:'TechDistributor SAC', fecha_creacion:'2024-01-05', fecha_ultima_actualizacion:'2025-04-08' },
  { id:11,sku:'LIM-011', nombre:'Limpiador Multiusos 5L', descripcion:'Desinfectante concentrado', categoria:'Limpieza', precio_compra:35, precio_venta:52, stock_actual:22, stock_minimo:10, proveedor:'CleanPro SAC', fecha_creacion:'2024-03-10', fecha_ultima_actualizacion:'2025-03-25' },
  { id:12,sku:'CAM-012', nombre:'Cámara IP Dahua 2MP', descripcion:'Cámara seguridad exterior', categoria:'Seguridad', precio_compra:190, precio_venta:270, stock_actual:14, stock_minimo:5, proveedor:'SecureTech Perú', fecha_creacion:'2024-02-20', fecha_ultima_actualizacion:'2025-04-02' },
]

export const MOCK_CATEGORIES = [
  { nombre:'Electrónica',     total_productos:6, valor_inventario:52480 },
  { nombre:'Mobiliario',      total_productos:2, valor_inventario:13910 },
  { nombre:'Papelería',       total_productos:2, valor_inventario:80   },
  { nombre:'Electrodomésticos',total_productos:1, valor_inventario:1980 },
  { nombre:'Limpieza',        total_productos:1, valor_inventario:770  },
  { nombre:'Seguridad',       total_productos:1, valor_inventario:2660 },
]

export const MOCK_SUPPLIERS = [
  { nombre:'TechDistributor SAC',  productos_activos:6 },
  { nombre:'OfficeSupplies Perú',  productos_activos:2 },
  { nombre:'Papelería Central',    productos_activos:2 },
  { nombre:'HomeGoods SAC',        productos_activos:1 },
  { nombre:'CleanPro SAC',         productos_activos:1 },
  { nombre:'SecureTech Perú',      productos_activos:1 },
]

export const MOCK_KPIs = {
  total_productos: 12,
  valor_inventario: 71880,
  productos_bajo_stock: 4,
  producto_mas_valioso: 'Laptop HP ProBook 450',
}

export const MOCK_TOP_CATEGORIES = [
  { name:'Electrónica', total:6 },
  { name:'Mobiliario', total:2 },
  { name:'Papelería', total:2 },
  { name:'Electrodomésticos', total:1 },
  { name:'Limpieza', total:1 },
  { name:'Seguridad', total:1 },
]

export const MOCK_DISTRIBUTION = [
  { name:'Electrónica',      value:52480 },
  { name:'Mobiliario',       value:13910 },
  { name:'Seguridad',        value:2660  },
  { name:'Electrodomésticos',value:1980  },
  { name:'Limpieza',         value:770   },
  { name:'Papelería',        value:80    },
]

export const MOCK_LOW_STOCK = MOCK_PRODUCTS.filter(p => p.stock_actual < p.stock_minimo)
