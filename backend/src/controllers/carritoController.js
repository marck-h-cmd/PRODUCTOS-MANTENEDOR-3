const prisma = require('../lib/prisma');

const getCarrito = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const cliente = await prisma.cli_clientes.findUnique({
      where: { usuario_id },
      include: {
        carrito: {
          include: {
            items: {
              include: {
                producto: {
                  include: {
                    imagenes: { where: { es_principal: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!cliente || !cliente.carrito) {
      return res.json({ success: true, data: { items: [] } });
    }

    res.json({ success: true, data: cliente.carrito });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener carrito', errors: error.message });
  }
};

const agregarAlCarrito = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { producto_id, cantidad = 1 } = req.body;

    let cliente = await prisma.cli_clientes.findUnique({
      where: { usuario_id },
      include: { carrito: true }
    });

    if (!cliente) {
      // Si no existe el cliente asociado al usuario, lo creamos
      // Nota: Esto debería ocurrir en el registro, pero lo manejamos por seguridad
      return res.status(400).json({ success: false, message: 'Cliente no encontrado' });
    }

    let carrito = cliente.carrito;
    if (!carrito) {
      carrito = await prisma.ord_carritos.create({
        data: { cliente_id: cliente.id }
      });
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = await prisma.ord_items_carrito.findFirst({
      where: {
        carrito_id: carrito.id,
        producto_id
      }
    });

    if (itemExistente) {
      await prisma.ord_items_carrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + cantidad }
      });
    } else {
      await prisma.ord_items_carrito.create({
        data: {
          carrito_id: carrito.id,
          producto_id,
          cantidad
        }
      });
    }

    res.json({ success: true, message: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al agregar al carrito', errors: error.message });
  }
};

const eliminarDelCarrito = async (req, res) => {
  try {
    const { item_id } = req.params;
    await prisma.ord_items_carrito.delete({
      where: { id: parseInt(item_id) }
    });
    res.json({ success: true, message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar del carrito', errors: error.message });
  }
};

module.exports = { getCarrito, agregarAlCarrito, eliminarDelCarrito };
