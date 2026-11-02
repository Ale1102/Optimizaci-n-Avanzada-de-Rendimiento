import { getToken } from './auth';
import type { Product, Order, PaginatedResponse, AuthResponse, User } from '@/types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token: explicitToken, ...fetchOptions } = options;
  
  // Try to get token from cookie (server-side)
  let authToken = explicitToken;
  if (!authToken) {
    try {
      authToken = await getToken();
    } catch {
      // Not in a server context where cookies are available
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============ Normalizers ============
// Laravel serializa columnas decimal como strings (ej. "19.99").
// Convertimos los campos numéricos a números reales para que `.toFixed()` sea seguro.

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : 0;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: toNumber(product.price),
    stock: toNumber(product.stock),
  };
}

// La API Laravel devuelve `total_amount`; el frontend usa `total`.
interface RawOrder extends Partial<Order> {
  total_amount?: number | string;
}

function normalizeOrder(order: RawOrder): Order {
  return {
    id: order.id ?? 0,
    user_id: order.user_id ?? 0,
    status: order.status ?? 'pending',
    created_at: order.created_at ?? new Date().toISOString(),
    updated_at: order.updated_at,
    total: toNumber(order.total ?? order.total_amount),
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          ...item,
          price: toNumber(item.price),
          quantity: toNumber(item.quantity),
          product: item.product ? normalizeProduct(item.product) : item.product,
        }))
      : [],
  };
}

// ============ Products ============

export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<Product[] | PaginatedResponse<Product>>('/products', {
    next: { tags: ['products'] },
  } as FetchOptions);
  
  // Handle both array and paginated response
  const products = Array.isArray(data) ? data : data.data;
  return products.map(normalizeProduct);
}

export async function getProduct(id: string | number): Promise<Product> {
  const product = await apiFetch<Product>(`/products/${id}`, {
    next: { tags: ['products', `product-${id}`] },
  } as FetchOptions);
  return normalizeProduct(product);
}

// ============ Auth ============
// La API Laravel (JWT) responde: { access_token, token_type, expires_in }.
// No devuelve el objeto `user`, así que lo obtenemos aparte con /me.

interface JwtResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<JwtResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return { token: data.access_token, user: await fetchUser(data.access_token) };
}

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await apiFetch<JwtResponse>('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return { token: data.access_token, user: await fetchUser(data.access_token) };
}

// Obtiene el usuario autenticado con el token recién emitido.
async function fetchUser(token: string): Promise<User> {
  try {
    return await apiFetch<User>('/me', { token });
  } catch {
    // Si /me falla, devolvemos un usuario mínimo para no romper el flujo.
    return { id: 0, name: '', email: '' };
  }
}

export async function logoutApi(): Promise<void> {
  await apiFetch<void>('/logout', {
    method: 'POST',
  });
}

// ============ Orders ============
// Historial de compras del usuario autenticado: GET /my-orders.

export async function getOrders(): Promise<Order[]> {
  const data = await apiFetch<RawOrder[] | PaginatedResponse<RawOrder>>('/my-orders', {
    cache: 'no-store',
  } as FetchOptions);

  const orders = Array.isArray(data) ? data : data.data;
  return orders.map(normalizeOrder);
}

// ============ Checkout / Stripe ============
// La API procesa TODO en un solo paso: recibe los items + el stripe_token,
// crea la orden, cobra con Stripe y devuelve la orden pagada.

export async function checkoutApi(
  items: { product_id: number; quantity: number }[],
  stripeToken: string
): Promise<Order> {
  const res = await apiFetch<{ message: string; order: RawOrder }>('/checkout', {
    method: 'POST',
    body: JSON.stringify({ items, stripe_token: stripeToken }),
  });
  return normalizeOrder(res.order);
}
