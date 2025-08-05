// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>
          &copy; {new Date().getFullYear()} Franco Toledo · Todos los derechos
          reservados.
        </p>
        <div className="space-x-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            GitHub
          </a>
          <a
            href="https://ant.design/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            Ant Design
          </a>
        </div>
      </div>
    </footer>
  );
}
