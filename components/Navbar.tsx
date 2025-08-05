// components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-dark-600">
            Ant Form Builder
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="https://ant.design/components/overview/"
            target="_blank"
            className="text-sm text-gray-700 hover:text-blue-600 transition"
          >
            Docs Ant Design
          </Link>
          <Link
            href="#"
            className="bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            Nuevo formulario
          </Link>
        </div>
      </div>
    </nav>
  );
}
