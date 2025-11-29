export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="text-center md:text-left">
            <p className="text-xs">
              <span className="font-medium text-gray-900 dark:text-gray-100">EasyLink</span> - © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs">Desenvolvido por <span className="font-semibold text-primary-custom">Claudemir Rosa</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

