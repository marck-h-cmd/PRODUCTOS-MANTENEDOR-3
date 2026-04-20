const router = require('express').Router();
const ctrl = require('../controllers/catSupplierController');
const { validateCategory } = require('../middlewares/validators');

router.get('/', ctrl.getAllCategories);
router.post('/', validateCategory, ctrl.createCategory);
router.put('/:nombre', validateCategory, ctrl.updateCategory);
router.delete('/:nombre', ctrl.deleteCategory);

module.exports = router;
