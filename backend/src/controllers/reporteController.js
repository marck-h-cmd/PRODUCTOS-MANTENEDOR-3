const PDFDocument = require('pdfkit');
const prisma = require('../lib/prisma');

const generarReporteStock = async (req, res) => {
  try {
    const stock = await prisma.inv_stock_producto.findMany({
      include: {
        producto: {
          include: { categoria: true }
        }
      }
    });

    const doc = new PDFDocument();
    let filename = `reporte-stock-${Date.now()}.pdf`;
    
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(20).text('Reporte de Inventario Valorizado', { align: 'center' });
    doc.moveDown();

    let totalValorizado = 0;

    stock.forEach(item => {
      const valor = item.cantidad * Number(item.producto.precio_costo);
      totalValorizado += valor;

      doc.fontSize(12).text(`SKU: ${item.producto.sku}`);
      doc.text(`Producto: ${item.producto.nombre}`);
      doc.text(`Categoría: ${item.producto.categoria.nombre}`);
      doc.text(`Cantidad: ${item.cantidad}`);
      doc.text(`Precio Costo: ${item.producto.precio_costo}`);
      doc.text(`Valor Total: ${valor.toFixed(2)}`);
      doc.moveDown();
    });

    doc.moveDown();
    doc.fontSize(14).text(`Valor Total del Inventario: ${totalValorizado.toFixed(2)}`, { align: 'right' });

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al generar reporte', errors: error.message });
  }
};

module.exports = { generarReporteStock };
