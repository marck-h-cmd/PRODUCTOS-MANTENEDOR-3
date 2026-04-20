const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Sequelize para la tabla CATEGORIES
 */
const Category = sequelize.define('Category', {
  nombre: { type: DataTypes.STRING(100), primaryKey: true },
  total_productos: { type: DataTypes.INTEGER, defaultValue: 0 },
  valor_inventario: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
}, {
  tableName: 'categories',
  timestamps: false,
});

/**
 * Modelo Sequelize para la tabla SUPPLIERS
 */
const Supplier = sequelize.define('Supplier', {
  nombre: { type: DataTypes.STRING(100), primaryKey: true },
  productos_activos: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'suppliers',
  timestamps: false,
});

module.exports = { Category, Supplier };
