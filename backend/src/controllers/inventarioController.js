const prisma = require('../lib/prisma');

const getStock = async (req, res) => {
  try {
    const stock = await prisma.inv_stock_producto.findMany({
      include: {
        producto: {
          select: {
            sku: true,
            nombre: true,
            categoria: { select: { nombre: true } }
          }
        }
      }
    });
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener stock', errors: error.message });
  }
};

const registrarMovimiento = async (req, res) => {
  try {
    const { producto_id, tipo_movimiento, cantidad, referencia } = req.body;
    const usuario_id = req.user.id;

    const stockActual = await prisma.inv_stock_producto.findUnique({
      where: { producto_id }
    });

    if (!stockActual && tipo_movimiento === 'SALIDA') {
      return res.status(400).json({ success: false, message: 'No hay stock para realizar salida' });
    }

    const nuevaCantidad = tipo_movimiento === 'ENTRADA' 
      ? (stockActual ? stockActual.cantidad + cantidad : cantidad)
      : (stockActual.cantidad - cantidad);

    if (nuevaCantidad < 0) {
      return res.status(400).json({ success: false, message: 'La salida excede el stock disponible' });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Actualizar o crear stock
      const updatedStock = await tx.inv_stock_producto.upsert({
        where: { producto_id },
        update: { cantidad: nuevaCantidad },
        create: { producto_id, cantidad: nuevaCantidad }
      });

      // 2. Registrar movimiento (Usamos auditoría para esto ya que la tabla movimientos_inventario tiene @ignore en el schema por ahora)
      await tx.auditoria_registro.create({
        data: {
          usuario_id,
          accion: `MOVIMIENTO_${tipo_movimiento}`,
          tabla: 'inv_stock_producto',
          registro_id: producto_id,
          payload: { cantidad, tipo_movimiento, referencia, stock_anterior: stockActual?.cantidad || 0, stock_nuevo: nuevaCantidad }
        }
      });

      return updatedStock;
    });

    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar movimiento', errors: error.message });
  }
};

module.exports = { getStock, registrarMovimiento };
