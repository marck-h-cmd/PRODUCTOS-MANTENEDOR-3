const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeding...');

  // 1. Roles y Permisos
  const adminRole = await prisma.seg_roles.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: { nombre: 'Administrador', descripcion: 'Acceso total' },
  });

  const clienteRole = await prisma.seg_roles.upsert({
    where: { nombre: 'Cliente' },
    update: {},
    create: { nombre: 'Cliente', descripcion: 'Usuario final' },
  });

  // 2. Usuarios
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.seg_usuarios.upsert({
    where: { email: 'admin@sistema.com' },
    update: {},
    create: {
      email: 'admin@sistema.com',
      password_hash: adminPassword,
      roles: {
        create: { rol_id: adminRole.id }
      }
    },
  });

  // 3. Categorías
  const catElectronica = await prisma.cat_categorias.upsert({
    where: { nombre: 'Electrónica' },
    update: {},
    create: { nombre: 'Electrónica' },
  });

  // 4. Marcas
  const marcaSony = await prisma.cat_marcas.upsert({
    where: { nombre: 'Sony' },
    update: {},
    create: { nombre: 'Sony' },
  });

  // 5. Unidades de Medida
  const unidad = await prisma.cat_unidades_medida.upsert({
    where: { nombre: 'Unidad' },
    update: {},
    create: { nombre: 'Unidad', abreviatura: 'Und' },
  });

  // 6. Productos (Ejemplo de 20 productos solicitado)
  for (let i = 1; i <= 20; i++) {
    await prisma.cat_productos.upsert({
      where: { sku: `PROD-${i}` },
      update: {},
      create: {
        sku: `PROD-${i}`,
        nombre: `Producto Ejemplo ${i}`,
        descripcion_corta: `Descripción corta del producto ${i}`,
        categoria_id: catElectronica.id,
        marca_id: marcaSony.id,
        unidad_medida_id: unidad.id,
        precio_costo: 50.00 + i,
        precio_venta: 100.00 + i,
        stock: {
          create: { cantidad: 10 + i }
        }
      },
    });
  }

  console.log('Seeding completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
