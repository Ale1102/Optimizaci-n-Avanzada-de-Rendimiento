'use server';

import { revalidatePath } from 'next/cache';
import { checkoutApi } from '@/lib/api';
import type { ActionResult } from '@/types';

export interface CheckoutResult extends ActionResult {
  orderId?: number;
}

// Procesa el pago en un solo paso contra la API Laravel:
// envía los items + el stripe_token, la API crea la orden y cobra con Stripe.
// En modo demo/pruebas se usa el token de prueba de Stripe "tok_visa".
export async function checkoutAction(
  items: { product_id: number; quantity: number }[],
  stripeToken = 'tok_visa'
): Promise<CheckoutResult> {
  if (!items || items.length === 0) {
    return { success: false, message: 'El carrito está vacío.' };
  }

  try {
    const order = await checkoutApi(items, stripeToken);

    // Evita interfaces desactualizadas tras la mutación.
    revalidatePath('/orders');

    return {
      success: true,
      message: '¡Pago procesado con éxito!',
      orderId: order.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al procesar el pago.',
    };
  }
}
