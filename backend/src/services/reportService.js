const jsreport = require('@jsreport/jsreport-core');
const Product = require('../models/Product');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

let reporter;

async function getReporter() {
  if (!reporter) {
    reporter = jsreport({ tempDirectory: './tmp' });
    reporter.use(require('@jsreport/jsreport-chrome-pdf')());
    reporter.use(require('@jsreport/jsreport-handlebars')());
    await reporter.init();
  }
  return reporter;
}

/**
 * Genera el PDF de Inventario Actual
 * @param {string} categoria - filtro opcional de categoría
 */
exports.generateInventoryReport = async (categoria) => {
  const rep = await getReporter();
  const where = categoria ? { categoria } : {};
  const products = await Product.findAll({ where, order: [['categoria', 'ASC'], ['nombre', 'ASC']] });

  const template = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', sans-serif; font-size: 11px; color: #1a1a2e; margin: 0; padding: 20px; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 12px; }
      .header h1 { font-size: 20px; color: #1e3a8a; margin: 0; }
      .header .meta { text-align: right; color: #64748b; font-size: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      thead tr { background: #1e3a8a; color: white; }
      th { padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 600; }
      td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; }
      tr:nth-child(even) { background: #f8fafc; }
      .low-stock { color: #dc2626; font-weight: 600; }
      .footer { margin-top: 24px; text-align: center; font-size: 9px; color: #94a3b8; }
      .kpi-row { display: flex; gap: 16px; margin-bottom: 20px; }
      .kpi-card { flex: 1; background: #f1f5f9; border-radius: 8px; padding: 12px; text-align: center; }
      .kpi-card .label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
      .kpi-card .value { font-size: 18px; font-weight: 700; color: #1e3a8a; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>Reporte de Inventario Actual</h1>
        {{#if categoria}}<p style="color:#2563eb;margin:4px 0 0">Categoría: {{categoria}}</p>{{/if}}
      </div>
      <div class="meta">
        <div>Fecha: {{fecha}}</div>
        <div>Total productos: {{total}}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>SKU</th><th>Nombre</th><th>Categoría</th><th>Proveedor</th>
          <th>Stock</th><th>Mín.</th><th>P. Compra</th><th>P. Venta</th><th>Valor Total</th>
        </tr>
      </thead>
      <tbody>
        {{#each products}}
        <tr>
          <td>{{sku}}</td>
          <td>{{nombre}}</td>
          <td>{{categoria}}</td>
          <td>{{proveedor}}</td>
          <td class="{{#if lowStock}}low-stock{{/if}}">{{stock_actual}}</td>
          <td>{{stock_minimo}}</td>
          <td>S/ {{precio_compra}}</td>
          <td>S/ {{precio_venta}}</td>
          <td>S/ {{valorTotal}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    <div class="footer">Sistema de Gestión de Inventario — Generado el {{fecha}}</div>
  </body>
  </html>
  `;

  const data = {
    fecha: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }),
    categoria: categoria || null,
    total: products.length,
    products: products.map(p => ({
      ...p.toJSON(),
      lowStock: p.stock_actual < p.stock_minimo,
      valorTotal: (p.stock_actual * parseFloat(p.precio_compra)).toFixed(2),
    })),
  };

  const result = await rep.render({
    template: { content: template, engine: 'handlebars', recipe: 'chrome-pdf',
      chrome: { landscape: true, format: 'A4', marginTop: '10mm', marginBottom: '10mm', marginLeft: '10mm', marginRight: '10mm' }
    },
    data,
  });

  return result.content;
};

/**
 * Reporte B: Análisis Estratégico con KPIs
 */
exports.generateStrategicReport = async () => {
  const rep = await getReporter();

  const [kpis] = await sequelize.query(`
    SELECT COUNT(*) AS total_productos,
           COALESCE(SUM(stock_actual * precio_compra), 0) AS valor_inventario,
           COUNT(*) FILTER (WHERE stock_actual < stock_minimo) AS productos_bajo_stock
    FROM products
  `, { type: QueryTypes.SELECT });

  const lowStockProducts = await Product.findAll({
    where: sequelize.literal('stock_actual < stock_minimo'),
    order: [['stock_actual', 'ASC']],
  });

  const template = `
  <!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body{font-family:'Segoe UI',sans-serif;font-size:11px;color:#1a1a2e;margin:0;padding:20px}
    .header{border-bottom:2px solid #2563eb;padding-bottom:12px;margin-bottom:20px}
    .header h1{font-size:20px;color:#1e3a8a;margin:0}
    .kpis{display:flex;gap:12px;margin-bottom:20px}
    .kpi{flex:1;background:#eff6ff;border-radius:8px;padding:14px;text-align:center;border:1px solid #bfdbfe}
    .kpi .v{font-size:22px;font-weight:700;color:#1e3a8a}
    .kpi .l{font-size:9px;color:#3b82f6;text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
    h2{font-size:14px;color:#1e3a8a;border-left:3px solid #2563eb;padding-left:8px;margin:20px 0 10px}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#1e3a8a;color:#fff}
    th{padding:8px 10px;text-align:left;font-size:10px}
    td{padding:7px 10px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even){background:#f8fafc}
    .badge{background:#fef2f2;color:#dc2626;padding:2px 8px;border-radius:9px;font-size:9px;font-weight:600}
    .footer{margin-top:24px;text-align:center;font-size:9px;color:#94a3b8}
  </style></head><body>
  <div class="header">
    <h1>Análisis Estratégico de Inventario</h1>
    <p style="color:#64748b;margin:4px 0 0;font-size:10px">Fecha: {{fecha}}</p>
  </div>
  <div class="kpis">
    <div class="kpi"><div class="v">{{total_productos}}</div><div class="l">Total Productos</div></div>
    <div class="kpi"><div class="v">S/ {{valor_inventario}}</div><div class="l">Valor Inventario</div></div>
    <div class="kpi"><div class="v">{{productos_bajo_stock}}</div><div class="l">Bajo Stock</div></div>
  </div>
  <h2>Productos que Requieren Reorden</h2>
  <table>
    <thead><tr><th>SKU</th><th>Nombre</th><th>Categoría</th><th>Stock Actual</th><th>Stock Mínimo</th><th>Déficit</th></tr></thead>
    <tbody>
      {{#each lowStock}}
      <tr>
        <td>{{sku}}</td><td>{{nombre}}</td><td>{{categoria}}</td>
        <td><span class="badge">{{stock_actual}}</span></td>
        <td>{{stock_minimo}}</td>
        <td>{{deficit}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <div class="footer">Sistema de Gestión de Inventario — Reporte Estratégico — {{fecha}}</div>
  </body></html>
  `;

  const result = await rep.render({
    template: { content: template, engine: 'handlebars', recipe: 'chrome-pdf',
      chrome: { format: 'A4', marginTop: '10mm', marginBottom: '10mm', marginLeft: '10mm', marginRight: '10mm' }
    },
    data: {
      fecha: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }),
      total_productos: kpis.total_productos,
      valor_inventario: parseFloat(kpis.valor_inventario).toLocaleString('es-PE', { minimumFractionDigits: 2 }),
      productos_bajo_stock: kpis.productos_bajo_stock,
      lowStock: lowStockProducts.map(p => ({
        ...p.toJSON(),
        deficit: p.stock_minimo - p.stock_actual,
      })),
    },
  });

  return result.content;
};
