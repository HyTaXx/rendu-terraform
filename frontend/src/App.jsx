import './App.css'
import { Link, Outlet, NavLink } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-full">
      <header className="border-b bg-white dark:bg-gray-900">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="text-xl font-semibold">
            <Link to="/" className="hover:text-blue-600">
              Crypto Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `text-gray-700 hover:text-blue-600 dark:text-gray-200 ${isActive ? 'font-semibold' : ''}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) => `text-gray-700 hover:text-blue-600 dark:text-gray-200 ${isActive ? 'font-semibold' : ''}`}
            >
              Comparer
            </NavLink>
            <ThemeToggle />
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
