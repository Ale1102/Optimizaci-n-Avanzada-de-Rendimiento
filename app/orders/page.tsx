import { Suspense } from 'react';
import { getOrders } from '@/lib/api';
import OrderList from '@/components/OrderList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Órdenes | E-Commerce',
  description: 'Historial de compras.',
};

async function OrdersContent() {
  const orders = await getOrders();
  return <OrderList orders={orders} />;
}

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Historial de Compras
      </h1>

      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-4 w-48" />
            </div>
            <div className="flex items-center gap-3">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
