'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { loginApi, registerApi, logoutApi } from '@/lib/api';
import { setToken, removeToken } from '@/lib/auth';
import type { ActionResult } from '@/types';

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email y contraseña son requeridos.' };
  }

  try {
    const data = await loginApi(email, password);
    await setToken(data.token);
    revalidatePath('/', 'layout');
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al iniciar sesión.',
    };
  }

  redirect('/products');
}

export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const password_confirmation = formData.get('password_confirmation') as string;

  if (!name || !email || !password || !password_confirmation) {
    return { success: false, message: 'Todos los campos son requeridos.' };
  }

  if (password !== password_confirmation) {
    return { success: false, message: 'Las contraseñas no coinciden.' };
  }

  try {
    const data = await registerApi(name, email, password);
    await setToken(data.token);
    revalidatePath('/', 'layout');
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al registrarse.',
    };
  }

  redirect('/products');
}

export async function logoutAction(): Promise<void> {
  try {
    await logoutApi();
  } catch {
    // Ignore API errors on logout
  }
  await removeToken();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}
