import FluentBot from "./FluentBot"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-600">FluentLoop</h1>
        <p className="text-sm text-gray-500">Speak. Learn. Improve.</p>
      </header>

      <main className="p-6 space-y-8">
        {/* Sección de práctica con FluentBot */}
        <FluentBot />
      </main>

      <footer className="bg-white text-center text-sm text-gray-400 py-4">
        FluentLoop © {new Date().getFullYear()} — Built with ♥
      </footer>
    </div>
  )
}
