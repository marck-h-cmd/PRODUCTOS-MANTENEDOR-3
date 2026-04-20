const { Category, Supplier } = require('../models/CategorySupplier');

// CATEGORIES CONTROLLER
exports.getAllCategories = async (req, res, next) => {
  try {
    const data = await Category.findAll({ order: [['nombre', 'ASC']] });
    res.json(data);
  } catch (e) { next(e); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ error: 'La categoría ya existe' });
    next(e);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.nombre);
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });
    await cat.update(req.body);
    res.json(cat);
  } catch (e) { next(e); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.nombre);
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });
    await cat.destroy();
    res.status(204).send();
  } catch (e) { next(e); }
};

// SUPPLIERS CONTROLLER
exports.getAllSuppliers = async (req, res, next) => {
  try {
    const data = await Supplier.findAll({ order: [['nombre', 'ASC']] });
    res.json(data);
  } catch (e) { next(e); }
};

exports.createSupplier = async (req, res, next) => {
  try {
    const sup = await Supplier.create(req.body);
    res.status(201).json(sup);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ error: 'El proveedor ya existe' });
    next(e);
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const sup = await Supplier.findByPk(req.params.nombre);
    if (!sup) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await sup.update(req.body);
    res.json(sup);
  } catch (e) { next(e); }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const sup = await Supplier.findByPk(req.params.nombre);
    if (!sup) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await sup.destroy();
    res.status(204).send();
  } catch (e) { next(e); }
};
