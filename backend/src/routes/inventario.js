const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(requireRole(['Administrador', 'Gerente de Inventario']));

router.get('/stock', inventarioController.getStock);
router.post('/movimiento', inventarioController.registrarMovimiento);

module.exports = router;
