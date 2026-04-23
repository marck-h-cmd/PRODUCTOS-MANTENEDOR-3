import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {producto.imagenes?.[0] ? (
          <img 
            src={producto.imagenes[0].url} 
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-1">
          {producto.categoria?.nombre}
        </div>
        <h3 className="font-semibold text-gray-900 truncate">{producto.nombre}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            S/ {Number(producto.precio_venta).toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              title="Ver detalle"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={() => onAddToCart(producto)}
              className="p-2 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors"
              title="Agregar al carrito"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
