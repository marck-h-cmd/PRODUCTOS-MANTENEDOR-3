const prisma = require('../lib/prisma');

const crearOrden = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { direccion_id, metodo_envio_id, metodo_pago } = req.body;

    const cliente = await prisma.cli_clientes.findUnique({
      where: { usuario_id },
      include: {
        carrito: {
          include: {
            items: {
              include: { producto: true }
            }
          }
        }
      }
    });

    if (!cliente || !cliente.carrito || cliente.carrito.items.length === 0) {
      return res.status(400).json({ success: false, message: 'El carrito está vacío' });
    }

    const subtotal = cliente.carrito.items.reduce((acc, item) => {
      return acc + (item.cantidad * Number(item.producto.precio_venta));
    }, 0);

    const impuestos = subtotal * 0.18; // Ejemplo 18% IGV
    const total = subtotal + impuestos;

    // Obtener estado inicial 'Pendiente'
    let estadoPendiente = await prisma.ord_estados_orden.findFirst({
      where: { nombre: 'Pendiente' }
    });

    if (!estadoPendiente) {
      estadoPendiente = await prisma.ord_estados_orden.create({
        data: { nombre: 'Pendiente', descripcion: 'Orden recién creada' }
      });
    }

    // Transacción para crear orden y limpiar carrito
    const orden = await prisma.$transaction(async (tx) => {
      // 1. Crear la orden
      const newOrden = await tx.ord_ordenes.create({
        data: {
          cliente_id: cliente.id,
          subtotal,
          impuestos,
          total,
          estado_id: estadoPendiente.id,
          metodo_envio_id,
          items: {
            create: cliente.carrito.items.map(item => ({
              producto_id: item.producto_id,
              cantidad: item.cantidad,
              precio_unitario: item.producto.precio_venta
            }))
          }
        }
      });

      // 2. Crear dirección de envío
      await tx.ord_direcciones_envio.create({
        data: {
          orden_id: newOrden.id,
          direccion_id
        }
      });

      // 3. Crear pago inicial
      await tx.ord_pagos.create({
        data: {
          orden_id: newOrden.id,
          metodo_pago,
          monto: total,
          estado: 'Pendiente'
        }
      });

      // 4. Limpiar carrito
      await tx.ord_items_carrito.deleteMany({
        where: { carrito_id: cliente.carrito.id }
      });

      return newOrden;
    });

    res.status(201).json({ success: true, data: orden });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear la orden', errors: error.message });
  }
};

const getMisOrdenes = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const cliente = await prisma.cli_clientes.findUnique({ where: { usuario_id } });

    const ordenes = await prisma.ord_ordenes.findMany({
      where: { cliente_id: cliente.id },
      include: {
        estado: true,
        items: {
          include: { producto: true }
        }
      },
      orderBy: { fecha_orden: 'desc' }
    });

    res.json({ success: true, data: ordenes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener órdenes', errors: error.message });
  }
};

module.exports = { crearOrden, getMisOrdenes };
