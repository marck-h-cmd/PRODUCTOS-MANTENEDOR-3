import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { FileText, BarChart2, Download, Filter, AlertCircle } from 'lucide-react'

export default function Reportes({ showToast }) {
  const [categories, setCategories] = useState([])
  const [filterCat, setFilterCat] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(console.error)
  }, [])

  const download = async (url, name) => {
    setLoading(true)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Error al generar el reporte')
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${name}_${new Date().getTime()}.pdf`
      link.click()
      showToast('Reporte generado correctamente')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Centro de Reportes</h1>
        <p>Generación de documentos PDF para análisis de negocio</p>
      </div>

      <div className="grid-2">
        {/* Reporte A */}
        <div className="card report-card">
          <div className="report-icon"><FileText size={32} /></div>
          <div className="report-info">
            <h3>Inventario Actual</h3>
            <p>Listado completo de productos con stock, costos y valor total de inventario.</p>
            
            <div className="report-filter">
              <label><Filter size={14} /> Filtrar por categoría (opcional)</label>
              <select className="form-control" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categories.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>

            <button className="btn btn-primary" onClick={() => download(api.reports.inventario(filterCat), 'Inventario_Actual')} disabled={loading}>
              <Download size={18} style={{ marginRight:8 }} /> 
              {loading ? 'Generando...' : 'Descargar Reporte'}
            </button>
          </div>
        </div>

        {/* Reporte B */}
        <div className="card report-card">
          <div className="report-icon" style={{ background:'var(--amber-50)', color:'var(--amber-600)' }}><BarChart2 size={32} /></div>
          <div className="report-info">
            <h3>Análisis Estratégico</h3>
            <p>Resumen ejecutivo con KPIs, productos con bajo stock y necesidades de reordenamiento.</p>
            
            <div style={{ height:74 }}></div> {/* Spacer to match height */}

            <button className="btn btn-primary" onClick={() => download(api.reports.estrategico(), 'Analisis_Estrategico')} disabled={loading}>
              <Download size={18} style={{ marginRight:8 }} /> 
              {loading ? 'Generando...' : 'Descargar Reporte'}
            </button>
          </div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop:24 }}>
        <AlertCircle size={18} />
        <p>Los reportes se generan en formato PDF profesional e incluyen encabezados corporativos y paginación automática.</p>
      </div>
    </div>
  )
}
