const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Sequelize para la tabla PRODUCTS
 */
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sku: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  categoria: { type: DataTypes.STRING(100), allowNull: false },
  precio_compra: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  precio_venta: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  stock_actual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  stock_minimo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  proveedor: { type: DataTypes.STRING(100), allowNull: false },
  fecha_creacion: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  fecha_ultima_actualizacion: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
}, {
  tableName: 'products',
  timestamps: false,
  hooks: {
    beforeUpdate: (product) => {
      product.fecha_ultima_actualizacion = new Date().toISOString().split('T')[0];
    },
  },
});

module.exports = Product;
