export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} E-Commerce Store. Todos los derechos reservados.</p>
          <p className="mt-1">Construido con Next.js 16 + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
