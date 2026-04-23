const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(requireRole(['Administrador', 'Gerente de Ventas', 'Gerente de Inventario']));

router.get('/stock', reporteController.generarReporteStock);

module.exports = router;
