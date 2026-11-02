// ============================================================================
// Almacén de datos en memoria para el SERVIDOR MOCK de la API.
//
// Simula la API Laravel 12 + Stripe mientras no tengas el backend real
// corriendo. NO es para producción: los datos viven en memoria del proceso
// y se reinician al reiniciar el servidor de desarrollo.
//
// Para usar la API real: cambia API_BASE_URL en .env.local y este mock
// deja de usarse automáticamente.
// ============================================================================

import type { Product, Order, User } from '@/types';

export interface StoredUser extends User {
  password: string;
  token: string;
}

// Usamos globalThis para que el estado sobreviva al hot-reload de Next.js dev.
interface MockDB {
  products: Product[];
  users: StoredUser[];
  orders: Order[];
  orderSeq: number;
  userSeq: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Auriculares Inalámbricos Pro',
    description:
      'Auriculares over-ear con cancelación activa de ruido, 30 h de batería y sonido de alta fidelidad.',
    price: 129.99,
    image_url:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 25,
    category_id: 1,
  },
  {
    id: 2,
    name: 'Teclado Mecánico RGB',
    description:
      'Teclado mecánico retroiluminado con switches rojos, diseño compacto 75% y estructura de aluminio.',
    price: 89.5,
    image_url:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    stock: 40,
    category_id: 2,
  },
  {
    id: 3,
    name: 'Mouse Ergonómico Inalámbrico',
    description:
      'Mouse ergonómico vertical con sensor de 4000 DPI, conexión Bluetooth y batería recargable.',
    price: 45.0,
    image_url:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    stock: 60,
    category_id: 2,
  },
  {
    id: 4,
    name: 'Monitor 27" 4K UHD',
    description:
      'Monitor IPS de 27 pulgadas con resolución 4K, HDR10, 99% sRGB y puertos USB-C con carga.',
    price: 349.99,
    image_url:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    stock: 15,
    category_id: 3,
  },
  {
    id: 5,
    name: 'Webcam Full HD 1080p',
    description:
      'Cámara web con enfoque automático, micrófono estéreo con reducción de ruido y corrección de luz.',
    price: 59.99,
    image_url:
      'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&q=80',
    stock: 0,
    category_id: 3,
  },
  {
    id: 6,
    name: 'Silla Gamer Ergonómica',
    description:
      'Silla ergonómica reclinable hasta 155°, soporte lumbar ajustable y reposabrazos 4D.',
    price: 219.0,
    image_url:
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
    stock: 8,
    category_id: 4,
  },
  {
    id: 7,
    name: 'Hub USB-C 7 en 1',
    description:
      'Adaptador multipuerto con HDMI 4K, 3x USB 3.0, lector SD/microSD y entrega de energía 100W.',
    price: 34.99,
    image_url:
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',
    stock: 50,
    category_id: 3,
  },
  {
    id: 8,
    name: 'Altavoz Bluetooth Portátil',
    description:
      'Altavoz resistente al agua IPX7, 20 W de potencia, 12 h de reproducción y sonido envolvente 360°.',
    price: 74.9,
    image_url:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    stock: 30,
    category_id: 1,
  },
];

function initDB(): MockDB {
  return {
    products: PRODUCTS,
    users: [
      {
        id: 1,
        name: 'Usuario Demo',
        email: 'demo@demo.com',
        password: 'password',
        token: 'demo-token-1',
        created_at: new Date().toISOString(),
      },
    ],
    orders: [],
    orderSeq: 1,
    userSeq: 2,
  };
}

const globalForDB = globalThis as unknown as { __mockDB?: MockDB };

export const db: MockDB = globalForDB.__mockDB ?? initDB();
if (!globalForDB.__mockDB) {
  globalForDB.__mockDB = db;
}

// Genera un token simple (no criptográfico, solo para demo).
export function generateToken(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Extrae el Bearer token del header Authorization.
export function getBearer(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) return null;
  return auth.slice(7).trim();
}

// Devuelve el usuario autenticado a partir del token, o null.
export function userFromRequest(request: Request): StoredUser | null {
  const token = getBearer(request);
  if (!token) return null;
  return db.users.find((u) => u.token === token) ?? null;
}
