const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post('/', ordenController.crearOrden);
router.get('/mis-ordenes', ordenController.getMisOrdenes);

module.exports = router;
