const { sequelize } = require('../config/database');
const Product = require('../models/Product');
const { QueryTypes } = require('sequelize');

/**
 * GET /api/dashboard/kpis
 * Retorna métricas clave del inventario
 */
exports.getKPIs = async (req, res, next) => {
  try {
    const [kpis] = await sequelize.query(`
      SELECT
        COUNT(*) AS total_productos,
        COALESCE(SUM(stock_actual * precio_compra), 0) AS valor_inventario,
        COUNT(*) FILTER (WHERE stock_actual < stock_minimo) AS productos_bajo_stock,
        (SELECT nombre FROM products ORDER BY (stock_actual * precio_compra) DESC LIMIT 1) AS producto_mas_valioso
      FROM products
    `, { type: QueryTypes.SELECT });

    res.json(kpis);
  } catch (error) { next(error); }
};

/**
 * GET /api/dashboard/top-categories
 * Top 10 categorías con más productos
 */
exports.getTopCategories = async (req, res, next) => {
  try {
    const data = await sequelize.query(`
      SELECT categoria AS name, COUNT(*) AS total
      FROM products
      GROUP BY categoria
      ORDER BY total DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * GET /api/dashboard/inventory-distribution
 * Distribución del valor de inventario por categoría
 */
exports.getInventoryDistribution = async (req, res, next) => {
  try {
    const data = await sequelize.query(`
      SELECT categoria AS name,
             ROUND(SUM(stock_actual * precio_compra)::numeric, 2) AS value
      FROM products
      GROUP BY categoria
      ORDER BY value DESC
    `, { type: QueryTypes.SELECT });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * GET /api/dashboard/low-stock
 * Productos con bajo stock
 */
exports.getLowStock = async (req, res, next) => {
  try {
    const data = await Product.findAll({
      where: sequelize.literal('stock_actual < stock_minimo'),
      order: [['stock_actual', 'ASC']],
    });
    res.json(data);
  } catch (error) { next(error); }
};
