import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard/ProductCard';
import { toast } from 'react-hot-toast';

const Catalogo = () => {
  const { data: productos, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const response = await api.get('/productos');
      return response.data.data;
    }
  });

  const handleAddToCart = async (producto) => {
    try {
      await api.post('/carrito/agregar', { producto_id: producto.id, cantidad: 1 });
      toast.success(`${producto.nombre} agregado al carrito`);
    } catch (err) {
      toast.error('Debes iniciar sesión para agregar al carrito');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Cargando catálogo...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error al cargar productos</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuestro Catálogo</h1>
        <p className="text-muted-foreground mt-2">Encuentra los mejores productos para tu negocio</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos?.map(producto => (
          <ProductCard 
            key={producto.id} 
            producto={producto} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
