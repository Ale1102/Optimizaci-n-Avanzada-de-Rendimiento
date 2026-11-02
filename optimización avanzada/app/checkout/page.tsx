'use client';

import { useCart } from '@/components/CartProvider';
import { checkoutAction } from '@/app/actions/orders';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No hay productos en el carrito
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Agrega productos antes de proceder al pago.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Ver Catálogo
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    // Token de prueba de Stripe (modo test). En producción se obtendría
    // con Stripe.js / Elements desde un formulario de tarjeta.
    const result = await checkoutAction(orderItems, 'tok_visa');

    if (result.success) {
      clearCart();
      router.push('/checkout/success');
    } else {
      setError(result.message || 'Error al procesar el pago.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Checkout
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Resumen del Pedido
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl">📦</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-gray-900 dark:text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Total a Pagar
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Envío</span>
                <span className="text-green-600 dark:text-green-400">Gratis</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                '💳 Pagar con Stripe'
              )}
            </button>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              Serás redirigido a Stripe para completar el pago de forma segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
