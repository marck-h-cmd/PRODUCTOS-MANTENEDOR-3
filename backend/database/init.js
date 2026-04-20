const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Script de inicialización de base de datos: tablas, disparadores y datos de muestra
 */
async function initDb() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'inventario_db',
    password: process.env.DB_PASS || 'password',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL para inicialización');

    // 1. Leer y ejecutar setup.sql (Tablas y Disparadores)
    console.log('⚙️ Creando tablas y disparadores...');
    const setupSql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    await client.query(setupSql);
    console.log('✅ Estructura de base de datos creada');

    // 2. Leer y ejecutar seeds.sql (Datos de muestra)
    console.log('🌱 Poblando base de datos con semillas...');
    const seedsSql = fs.readFileSync(path.join(__dirname, 'seeds.sql'), 'utf8');
    await client.query(seedsSql);
    console.log('✅ Datos de muestra insertados correctamente');

  } catch (err) {
    console.error('❌ Error durante la inicialización:', err);
  } finally {
    await client.end();
  }
}

initDb();
