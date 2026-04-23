const prisma = require('../lib/prisma');
const { z } = require('zod');

const productoSchema = z.object({
  sku: z.string().min(3),
  nombre: z.string().min(3),
  descripcion_corta: z.string().optional(),
  descripcion_larga: z.string().optional(),
  categoria_id: z.number().int(),
  subcategoria_id: z.number().int().optional(),
  marca_id: z.number().int().optional(),
  unidad_medida_id: z.number().int().optional(),
  precio_costo: z.number().positive(),
  precio_venta: z.number().positive(),
  precio_oferta: z.number().positive().optional(),
  activo: z.boolean().default(true),
});

const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, categoria, marca, minPrice, maxPrice, sort } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      activo: true,
      AND: [
        search ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { descripcion_corta: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        categoria ? { categoria_id: parseInt(categoria) } : {},
        marca ? { marca_id: parseInt(marca) } : {},
        minPrice ? { precio_venta: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { precio_venta: { lte: parseFloat(maxPrice) } } : {},
      ]
    };

    let orderBy = { created_at: 'desc' };
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order };
    }

    const [productos, total] = await Promise.all([
      prisma.cat_productos.findMany({
        where,
        include: {
          categoria: true,
          marca: true,
          imagenes: { where: { es_principal: true }, take: 1 },
          stock: true,
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy,
      }),
      prisma.cat_productos.count({ where })
    ]);

    res.json({
      success: true,
      data: productos,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener productos', errors: error.message });
  }
};

const getProductoBySku = async (req, res) => {
  try {
    const { sku } = req.params;
    const producto = await prisma.cat_productos.findUnique({
      where: { sku },
      include: {
        categoria: true,
        subcategoria: true,
        marca: true,
        unidad_medida: true,
        imagenes: true,
        atributos: {
          include: {
            valor_atributo: {
              include: {
                atributo: true
              }
            }
          }
        },
        stock: true,
        resenas: {
          include: {
            cliente: true
          },
          take: 10,
          orderBy: { fecha: 'desc' }
        }
      }
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener producto', errors: error.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const data = productoSchema.parse(req.body);
    const producto = await prisma.cat_productos.create({
      data,
      include: {
        categoria: true,
        marca: true
      }
    });

    // Inicializar stock
    await prisma.inv_stock_producto.create({
      data: {
        producto_id: producto.id,
        cantidad: 0
      }
    });

    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'Error al crear producto', errors: error.message });
  }
};

module.exports = { getProductos, getProductoBySku, createProducto };
