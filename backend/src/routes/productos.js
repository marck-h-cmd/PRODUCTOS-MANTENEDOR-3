const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', productoController.getProductos);
router.get('/:sku', productoController.getProductoBySku);

// Rutas protegidas para admin y gerentes
router.post('/', verifyToken, requireRole(['Administrador', 'Gerente de Inventario']), productoController.createProducto);

module.exports = router;
