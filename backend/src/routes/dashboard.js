// routes/dashboard.js
const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');

router.get('/kpis', ctrl.getKPIs);
router.get('/top-categories', ctrl.getTopCategories);
router.get('/inventory-distribution', ctrl.getInventoryDistribution);
router.get('/low-stock', ctrl.getLowStock);

module.exports = router;
