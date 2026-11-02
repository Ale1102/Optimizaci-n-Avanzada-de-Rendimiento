import { getProduct } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.name} | E-Commerce`,
      description: product.description,
    };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/products"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-8xl text-gray-300 dark:text-gray-600">
              📦
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                {product.stock} disponibles
              </span>
            ) : (
              <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                Agotado
              </span>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
