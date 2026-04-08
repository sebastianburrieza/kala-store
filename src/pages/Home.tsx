import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-12">

      {/* Hero */}
      <section className="bg-gray-100 rounded-2xl px-10 py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Nueva Colección</h1>
        <p className="text-gray-500 text-lg mb-8">Ropa y accesorios para cada momento</p>
        <Link
          to="/catalog"
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800"
        >
          Ver catálogo
        </Link>
      </section>

      {/* Categorías */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/catalog?category=ropa" className="bg-gray-100 rounded-xl p-8 text-center hover:bg-gray-200">
            <span className="text-4xl">👗</span>
            <p className="mt-2 font-medium text-gray-900">Ropa</p>
          </Link>
          <Link to="/catalog?category=accesorios" className="bg-gray-100 rounded-xl p-8 text-center hover:bg-gray-200">
            <span className="text-4xl">👜</span>
            <p className="mt-2 font-medium text-gray-900">Accesorios</p>
          </Link>
        </div>
      </section>

    </div>
  )
}