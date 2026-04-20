import { LayoutDashboard, Package, Folders, Truck, FileBarChart } from 'lucide-react'

const NAV = [
  { id: 'dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { id: 'productos',   icon: <Package size={18} />,  label: 'Productos' },
  { id: 'categorias',  icon: <Folders size={18} />,  label: 'Categorías' },
  { id: 'proveedores', icon: <Truck size={18} />,  label: 'Proveedores' },
  { id: 'reportes',    icon: <FileBarChart size={18} />,  label: 'Reportes' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 'var(--sidebar-w)',
      background: 'var(--blue-900)',
      display: 'flex', flexDirection: 'column',
      padding: '0',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--blue-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: '#fff', fontWeight: 700,
          }}>G</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>GestiónPro</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>Inventario</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.8px', textTransform: 'uppercase', fontWeight: 600, padding: '0 8px', marginBottom: 8 }}>
          Módulos
        </div>
        {NAV.map(item => {
          const active = current === item.id
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? 'var(--blue-600)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,.55)',
              fontSize: 13, fontWeight: active ? 500 : 400,
              marginBottom: 4, textAlign: 'left', transition: 'all .15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.55)'; }}}
            >
              <span style={{ display:'flex', alignItems:'center' }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.08)', fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
        v1.0.0 · Full Stack Pro
      </div>
    </aside>
  )
}
