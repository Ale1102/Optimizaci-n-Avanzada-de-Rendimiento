# 🛒 E-Commerce Frontend — Next.js 16

Frontend de e-commerce construido con **Next.js 16** (App Router), **TypeScript** y **Tailwind CSS 4**, que consume una API REST de Laravel 12 con autenticación Bearer Token y pagos con Stripe.

## 📋 Stack Tecnológico

- **Next.js 16.3.5** (App Router + Turbopack)
- **React 19.2.8** (Server Components + Server Actions)
- **TypeScript 5**
- **Tailwind CSS 4**
- Consumo de API REST (Laravel 12 + Swagger + Stripe)

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd optimización-avanzada
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env.local` y configurar la URL de la API:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=E-Commerce Store
API_BASE_URL=http://localhost:8000/api
```

> **Nota**: `API_BASE_URL` debe apuntar a tu API Laravel (sin trailing slash).

#### 🧪 Modo Demo (sin backend Laravel)

El proyecto incluye un **servidor mock interno** (Route Handlers en `app/api/mock/`) que
simula la API Laravel + Stripe, por si quieres probar el flujo completo sin levantar el backend.

Para activarlo, en `.env.local`:

```env
API_BASE_URL=http://localhost:3000/api/mock
```

Credenciales de prueba:

- **Email**: `demo@demo.com`
- **Password**: `password`

(También puedes registrar un usuario nuevo desde `/auth/register`.)

> El mock guarda los datos en memoria, así que se reinician al reiniciar el servidor.
> Para usar la API real, vuelve a poner `API_BASE_URL=http://localhost:8000/api`.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### 5. Build de producción

```bash
npm run build
npm start
```

## 🗂️ Rutas Implementadas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Redirect | Redirige a `/products` |
| `/products` | Pública | Catálogo de productos (Server Component + Suspense) |
| `/products/[id]` | Pública | Detalle de producto con SEO dinámico |
| `/auth/login` | Pública | Formulario de inicio de sesión |
| `/auth/register` | Pública | Formulario de registro |
| `/cart` | Pública | Carrito de compras (estado local) |
| `/checkout` | Protegida | Resumen y pago con Stripe |
| `/checkout/success` | Protegida | Confirmación de compra exitosa |
| `/orders` | Protegida | Historial de compras (Server Component + Suspense) |
| `/orders/[id]` | Protegida | Detalle de orden |

## 🔌 Endpoints de API Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/register` | Registro de usuario |
| `POST` | `/api/login` | Login (retorna Bearer Token) |
| `POST` | `/api/logout` | Cerrar sesión |
| `GET` | `/api/products` | Listar productos |
| `GET` | `/api/products/{id}` | Detalle de producto |
| `POST` | `/api/orders` | Crear orden |
| `GET` | `/api/orders` | Historial de órdenes |
| `GET` | `/api/orders/{id}` | Detalle de orden |
| `POST` | `/api/checkout` | Crear sesión de pago Stripe |

## ⚡ Rendimiento y Resiliencia

### Loading States (`loading.tsx`)
- `/products` — Skeleton grid de productos
- `/products/[id]` — Skeleton de detalle
- `/checkout` — Skeleton del checkout
- `/orders` — Skeleton del historial

### Error Boundaries (`error.tsx`)
- `/products` — Error con botón "Reintentar"
- `/checkout` — Error del checkout
- `/orders` — Error del historial

### Suspense Boundaries
- **Catálogo de productos** — `<Suspense>` envuelve la lista de productos
- **Historial de órdenes** — `<Suspense>` envuelve la lista de órdenes

### Revalidación Post-Mutación
- `revalidatePath('/', 'layout')` — Tras login/register/logout
- `revalidatePath('/orders')` — Tras crear orden

### Seguridad
- Token almacenado en cookie `httpOnly` (no accesible desde JavaScript del cliente)
- Middleware (`proxy.ts`) protege rutas `/checkout/*` y `/orders/*`
- Redirect automático a login con parámetro `?redirect=` para volver después

## 🏗️ Arquitectura

```
├── app/
│   ├── layout.tsx            # Layout raíz + CartProvider + Navbar
│   ├── page.tsx              # Home → redirect a /products
│   ├── actions/
│   │   ├── auth.ts           # Server Actions: login, register, logout
│   │   └── orders.ts         # Server Actions: crear orden + pago
│   ├── products/             # Catálogo (Server Components)
│   ├── auth/                 # Login y Registro
│   ├── cart/                 # Carrito (Client Component)
│   ├── checkout/             # Checkout + Stripe
│   └── orders/               # Historial de compras (Server Components)
├── components/               # Componentes reutilizables
├── lib/
│   ├── api.ts                # Fetch wrapper centralizado
│   └── auth.ts               # Utilidades de cookies/token
├── types/
│   └── index.ts              # Interfaces TypeScript
└── proxy.ts                  # Middleware de protección de rutas
```

## 📦 Flujo de Compra

1. **Catálogo** → Navegar productos
2. **Detalle** → Ver información y agregar al carrito
3. **Carrito** → Revisar items, ajustar cantidades
4. **Checkout** → Crear orden y redirigir a Stripe
5. **Stripe** → Completar pago seguro
6. **Confirmación** → Compra exitosa, carrito limpio
7. **Historial** → Ver todas las órdenes

## 📊 Lighthouse

Ejecutar auditoría de rendimiento:
1. Abrir Chrome DevTools → Lighthouse
2. Seleccionar: Performance, Accessibility, Best Practices, SEO
3. Ejecutar auditoría en modo Navigation

---

Construido con ❤️ usando Next.js 16 + TypeScript + Tailwind CSS
