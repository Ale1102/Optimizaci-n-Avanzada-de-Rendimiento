import Link from 'next/link';
import type { Order } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">📋</p>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tienes órdenes aún
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Explora nuestro catálogo y realiza tu primera compra.
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

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Orden #{order.id}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(order.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {order.items && order.items.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Detalle de productos de la orden */}
          {order.items && order.items.length > 0 && (
            <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                >
                  <span>
                    {item.product?.name || `Producto #${item.product_id}`}
                    <span className="text-gray-400 dark:text-gray-500">
                      {' '}× {item.quantity}
                    </span>
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
