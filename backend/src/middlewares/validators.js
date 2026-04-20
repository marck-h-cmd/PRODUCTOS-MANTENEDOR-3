// src/middlewares/validators.js
const { body, validationResult } = require('express-validator');

const { Category, Supplier } = require('../models/CategorySupplier');

/**
 * Middleware para capturar y devolver errores de validación
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Retornamos el primer error para mayor simplicidad en el frontend
    return res.status(400).json({ 
      error: errors.array()[0].msg,
      detalles: errors.array()
    });
  }
  next();
};

/**
 * Reglas de validación para PRODUCTOS
 */
const validateProduct = [
  body('sku')
    .notEmpty().withMessage('El SKU es obligatorio')
    .isString().withMessage('El SKU debe ser una cadena de texto')
    .isLength({ min: 3, max: 50 }).withMessage('El SKU debe tener entre 3 y 50 caracteres')
    .trim(),
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres')
    .trim(),
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .custom(async (value) => {
      const cat = await Category.findByPk(value);
      if (!cat) throw new Error('La categoría seleccionada no existe');
      return true;
    }),
  body('precio_compra')
    .notEmpty().withMessage('El precio de compra es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio de compra debe ser un número positivo'),
  body('precio_venta')
    .notEmpty().withMessage('El precio de venta es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo')
    .custom((value, { req }) => {
      if (parseFloat(value) < parseFloat(req.body.precio_compra)) {
        throw new Error('El precio de venta no debe ser menor al de compra');
      }
      return true;
    }),
  body('stock_actual')
    .notEmpty().withMessage('El stock actual es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock actual debe ser un número entero (0 o más)'),
  body('stock_minimo')
    .notEmpty().withMessage('El stock mínimo es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero (0 o más)'),
  body('proveedor')
    .notEmpty().withMessage('El proveedor es obligatorio')
    .custom(async (value) => {
      const sup = await Supplier.findByPk(value);
      if (!sup) throw new Error('El proveedor seleccionado no existe');
      return true;
    }),
  validateResult
];

/**
 * Reglas de validación para CATEGORÍAS
 */
const validateCategory = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la categoría es obligatorio')
    .isString().withMessage('Nombre inválido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  validateResult
];

/**
 * Reglas de validación para PROVEEDORES
 */
const validateSupplier = [
  body('nombre')
    .notEmpty().withMessage('El nombre del proveedor es obligatorio')
    .isString().withMessage('Nombre inválido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  validateResult
];

module.exports = { 
  validateProduct, 
  validateCategory, 
  validateSupplier 
};
