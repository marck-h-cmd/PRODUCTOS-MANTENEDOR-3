// routes/suppliers.js
const router = require('express').Router();
const ctrl = require('../controllers/catSupplierController');
const { validateSupplier } = require('../middlewares/validators');

router.get('/', ctrl.getAllSuppliers);
router.post('/', validateSupplier, ctrl.createSupplier);
router.put('/:nombre', validateSupplier, ctrl.updateSupplier);
router.delete('/:nombre', ctrl.deleteSupplier);

module.exports = router;
