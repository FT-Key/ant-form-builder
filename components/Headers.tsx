// components/Header.tsx
export default function Header() {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="inline-block">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
          Form Builder
        </h1>
        <div className="w-12 h-px bg-gray-900 mx-auto mt-4"></div>
      </div>
      <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
        Create professional Ant Design forms with precision and elegance.
      </p>
    </div>
  );
}
