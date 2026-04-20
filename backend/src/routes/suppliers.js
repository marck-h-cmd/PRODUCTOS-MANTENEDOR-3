// routes/suppliers.js
const router = require('express').Router();
const ctrl = require('../controllers/catSupplierController');

router.get('/', ctrl.getAllSuppliers);
router.post('/', ctrl.createSupplier);
router.put('/:nombre', ctrl.updateSupplier);
router.delete('/:nombre', ctrl.deleteSupplier);

module.exports = router;
