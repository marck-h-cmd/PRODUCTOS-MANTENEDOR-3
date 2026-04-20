const router = require('express').Router();
const ctrl = require('../controllers/catSupplierController');

router.get('/', ctrl.getAllCategories);
router.post('/', ctrl.createCategory);
router.put('/:nombre', ctrl.updateCategory);
router.delete('/:nombre', ctrl.deleteCategory);

module.exports = router;
