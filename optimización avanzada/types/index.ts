// Product from the API
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
}

// User from the API
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

// Order item
export interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

// Order
export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

// Cart item (local state)
export interface CartItem {
  product: Product;
  quantity: number;
}

// API error response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// API paginated response
export interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  total?: number;
}

// Auth response from login/register
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

// Checkout response
export interface CheckoutResponse {
  checkout_url: string;
  session_id?: string;
}

// Server Action result
export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}
