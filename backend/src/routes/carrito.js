const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', carritoController.getCarrito);
router.post('/agregar', carritoController.agregarAlCarrito);
router.delete('/item/:item_id', carritoController.eliminarDelCarrito);

module.exports = router;
