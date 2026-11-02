'use client';

import { useActionState } from 'react';
import { registerAction } from '@/app/actions/auth';
import Link from 'next/link';
import type { ActionResult } from '@/types';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    registerAction,
    null
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Crear Cuenta
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Regístrate para comenzar a comprar.
            </p>
          </div>

          {state?.message && !state.success && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirmar Contraseña
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
