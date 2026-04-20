import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Plus, Edit2, Trash2, Folder, X, TrendingUp, Package } from 'lucide-react'

const EMPTY = { nombre: '' }
const fmtS = n => 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2 })

export default function Categorias({ showToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.categories.getAll()
      setItems(data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const validate = () => {
    const e = {}
    const trimmedNombre = form.nombre?.trim()
    if (!trimmedNombre) e.nombre = 'El nombre es obligatorio'
    else if (trimmedNombre.length < 2) e.nombre = 'Mínimo 2 caracteres'
    else if (items.some(cat => cat.nombre.toLowerCase() === trimmedNombre.toLowerCase() && cat.nombre !== editing)) {
      e.nombre = 'Esta categoría ya existe'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (v) => {
    setForm({ nombre: v })
    if (errors.nombre) setErrors({})
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        await api.categories.update(editing, form)
        showToast('Categoría actualizada')
      } else {
        await api.categories.create(form)
        showToast('Categoría creada')
      }
      setModal(null)
      load()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (name) => {
    if (!confirm(`¿Eliminar categoría "${name}"? Los productos asociados podrían quedar sin categoría.`)) return
    try {
      await api.categories.delete(name)
      showToast('Categoría eliminada')
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Categorías</h1>
        <p>{items.length} categorías configuradas</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left"></div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setModal('form'); setErrors({}); }}>
          <Plus size={18} style={{ marginRight:8 }} /> Nueva Categoría
        </button>
      </div>

      <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
        {loading ? <div className="loading">Cargando...</div> : items.map(c => (
          <div key={c.nombre} className="card cat-card">
            <div className="cat-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div className="cat-icon" style={{ background:'var(--blue-50)', color:'var(--blue-600)', width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}><Folder size={20} /></div>
                <h3 style={{ fontSize:15, fontWeight:600 }}>{c.nombre}</h3>
              </div>
              <div className="cat-actions" style={{ display:'flex', gap:6 }}>
                <button className="btn-icon" onClick={() => { setForm({ nombre: c.nombre }); setEditing(c.nombre); setModal('form'); setErrors({}); }}><Edit2 size={14} /></button>
                <button className="btn-icon delete" onClick={() => handleDelete(c.nombre)}><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="cat-stats" style={{ display:'flex', gap:16, borderTop:'1px solid var(--gray-100)', paddingTop:12 }}>
              <div className="cat-stat" style={{ flex:1 }}>
                <span className="l" style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--gray-500)', marginBottom:2 }}><Package size={12} /> Productos</span>
                <span className="v" style={{ fontSize:16, fontWeight:600 }}>{c.total_productos}</span>
              </div>
              <div className="cat-stat" style={{ flex:1 }}>
                <span className="l" style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--gray-500)', marginBottom:2 }}><TrendingUp size={12} /> Valor</span>
                <span className="v" style={{ fontSize:16, fontWeight:600 }}>{fmtS(c.valor_inventario)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal === 'form' && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div className="modal-icon-bg" style={{ background:'var(--blue-50)', color:'var(--blue-600)', padding:8, borderRadius:8, display:'flex' }}><Folder size={20} /></div>
                <h2>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              </div>
              <button className="btn-icon" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label>Nombre de la Categoría *</label>
              <input className={`form-control${errors.nombre?' error':''}`} value={form.nombre} 
                onChange={e => handleChange(e.target.value)} 
                placeholder="Ej. Electrónica, Hogar..." disabled={saving} autoFocus />
              {errors.nombre && <span className="form-error">{errors.nombre}</span>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)} disabled={saving}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
