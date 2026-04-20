// middlewares/validators.js
const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('sku').notEmpty().withMessage('SKU es requerido').trim(),
  body('nombre').notEmpty().withMessage('Nombre es requerido').trim(),
  body('categoria').notEmpty().withMessage('Categoría es requerida'),
  body('precio_compra').isFloat({ min: 0 }).withMessage('Precio de compra inválido'),
  body('precio_venta').isFloat({ min: 0 }).withMessage('Precio de venta inválido'),
  body('stock_actual').isInt({ min: 0 }).withMessage('Stock actual inválido'),
  body('stock_minimo').isInt({ min: 0 }).withMessage('Stock mínimo inválido'),
  body('proveedor').notEmpty().withMessage('Proveedor es requerido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
  },
];

module.exports = { validateProduct };
