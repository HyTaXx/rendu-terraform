import './App.css'
import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-full">
      <header className="bg-white border-b">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="text-xl font-semibold">
            <Link to="/" className="hover:text-blue-600">
              My App
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App
