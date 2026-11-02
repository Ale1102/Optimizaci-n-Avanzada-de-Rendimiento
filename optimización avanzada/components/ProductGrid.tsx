import type { Product } from '@/types';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">🔍</p>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No se encontraron productos
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Intenta más tarde o contacta al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
