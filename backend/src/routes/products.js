// routes/products.js
const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validators');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', validateProduct, ctrl.create);
router.put('/:id', validateProduct, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
