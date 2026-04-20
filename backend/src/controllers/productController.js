const { Op } = require('sequelize');
const Product = require('../models/Product');

/**
 * GET /api/products
 * Lista todos los productos con paginación y búsqueda
 */
exports.getAll = async (req, res, next) => {
  try {
    const { search = '', categoria, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { categoria: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (categoria) where.categoria = categoria;

    const { count, rows } = await Product.findAndCountAll({
      where, limit: parseInt(limit), offset, order: [['id', 'DESC']],
    });

    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (error) { next(error); }
};

/**
 * GET /api/products/:id
 */
exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) { next(error); }
};

/**
 * POST /api/products
 */
exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El SKU ya existe en el sistema' });
    }
    next(error);
  }
};

/**
 * PUT /api/products/:id
 */
exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    await product.update(req.body);
    res.json(product);
  } catch (error) { next(error); }
};

/**
 * DELETE /api/products/:id
 */
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    await product.destroy();
    res.status(204).send();
  } catch (error) { next(error); }
};
