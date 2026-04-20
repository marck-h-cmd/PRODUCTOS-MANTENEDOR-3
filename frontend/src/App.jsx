import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import Reportes from './pages/Reportes'
import Toast from './components/Toast'
import './index.css'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const pages = {
    dashboard: <Dashboard showToast={showToast} />,
    productos: <Productos showToast={showToast} />,
    categorias: <Categorias showToast={showToast} />,
    proveedores: <Proveedores showToast={showToast} />,
    reportes: <Reportes showToast={showToast} />,
  }

  return (
    <div className="app-layout">
      <Sidebar current={page} onNavigate={setPage} />
      <main className="main-content">
        {pages[page]}
      </main>
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
