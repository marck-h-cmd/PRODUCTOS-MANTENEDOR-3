import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { api } from '../services/api'

const PIE_COLORS = ['#2563eb','#1e3a8a','#60a5fa','#93c5fd','#bfdbfe','#dbeafe']

const fmt = (n) => Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 })
const fmtS = (n) => 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2 })

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    total_productos: 0,
    valor_inventario: 0,
    productos_bajo_stock: 0,
    producto_mas_valioso: '-'
  })
  const [topCats, setTopCats] = useState([])
  const [dist, setDist] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [k, t, d, l] = await Promise.all([
          api.dashboard.kpis(),
          api.dashboard.topCategories(),
          api.dashboard.distribution(),
          api.dashboard.lowStock(),
        ])
        setKpis(k)
        setTopCats(t)
        // Asegurar que value sea número para el gráfico de torta
        setDist(d.map(item => ({ ...item, value: parseFloat(item.value) })))
        setLowStock(l)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="loading">Cargando métricas...</div>

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen general del inventario y métricas clave</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background:'var(--blue-50)' }}>📦</div>
          <div className="kpi-label">Total Productos</div>
          <div className="kpi-value">{fmt(kpis.total_productos)}</div>
          <div className="kpi-sub">SKUs únicos en inventario</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background:'#f0fdf4' }}>💰</div>
          <div className="kpi-label">Valor del Inventario</div>
          <div className="kpi-value" style={{ fontSize:20 }}>{fmtS(kpis.valor_inventario)}</div>
          <div className="kpi-sub">Stock × Precio de compra</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background:'var(--red-50)' }}>⚠️</div>
          <div className="kpi-label">Bajo Stock</div>
          <div className="kpi-value" style={{ color:'var(--red-600)' }}>{kpis.productos_bajo_stock}</div>
          <div className="kpi-sub">Productos por reordenar</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background:'var(--amber-50)' }}>⭐</div>
          <div className="kpi-label">Más Valioso</div>
          <div className="kpi-value" style={{ fontSize:14, fontFamily:'DM Sans', letterSpacing:0, fontWeight:600 }}>{kpis.producto_mas_valioso}</div>
          <div className="kpi-sub">Mayor valor en stock</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="chart-title">Top categorías por cantidad de productos</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topCats} margin={{ top:4, right:8, left:0, bottom:0 }}>
              <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--gray-500)' }} />
              <YAxis tick={{ fontSize:11, fill:'var(--gray-500)' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize:12, borderRadius:6, border:'1px solid var(--gray-300)' }}
                formatter={v => [v, 'Productos']}
              />
              <Bar dataKey="total" fill="var(--blue-600)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">Distribución del valor de inventario</div>
          <ResponsiveContainer width="100%" height={240}>
            {dist.length > 0 ? (
              <PieChart>
                <Pie data={dist} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  dataKey="value" nameKey="name" paddingAngle={5}>
                  {dist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip formatter={v => [fmtS(v), 'Valor']} contentStyle={{ fontSize:12, borderRadius:8, border:'none', boxShadow:'var(--shadow-md)' }} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize:11, paddingTop:10 }} />
              </PieChart>
            ) : (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--gray-400)', fontSize:13 }}>
                No hay datos suficientes
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low stock table */}
      <div className="card">
        <div className="chart-title" style={{ marginBottom:12 }}>
          Productos que requieren reorden
          <span className="badge badge-red" style={{ marginLeft:8 }}>{lowStock.length}</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Nombre</th><th>Categoría</th>
                <th>Stock Actual</th><th>Stock Mínimo</th><th>Déficit</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map(p => (
                <tr key={p.id}>
                  <td><code style={{ fontFamily:'DM Mono', fontSize:12 }}>{p.sku}</code></td>
                  <td>{p.nombre}</td>
                  <td><span className="badge badge-blue">{p.categoria}</span></td>
                  <td><span className="badge badge-red">{p.stock_actual}</span></td>
                  <td>{p.stock_minimo}</td>
                  <td style={{ color:'var(--red-600)', fontWeight:600 }}>
                    -{p.stock_minimo - p.stock_actual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
