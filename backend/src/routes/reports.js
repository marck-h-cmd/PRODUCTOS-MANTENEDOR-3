// routes/reports.js
const router = require('express').Router();
const reportService = require('../services/reportService');

router.get('/inventario', async (req, res, next) => {
  try {
    const { categoria } = req.query;
    const pdfBuffer = await reportService.generateInventoryReport(categoria);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=inventario.pdf' });
    res.send(pdfBuffer);
  } catch (e) { next(e); }
});

router.get('/estrategico', async (req, res, next) => {
  try {
    const pdfBuffer = await reportService.generateStrategicReport();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=analisis-estrategico.pdf' });
    res.send(pdfBuffer);
  } catch (e) { next(e); }
});

module.exports = router;
