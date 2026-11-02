'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import type { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
      >
        Producto Agotado
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Cantidad:
        </label>
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg transition"
          >
            −
          </button>
          <span className="px-4 py-2 font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 ${
          added
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {added ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
      </button>
    </div>
  );
}
