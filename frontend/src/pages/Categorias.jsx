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

  const handleSave = async () => {
    if (!form.nombre) return showToast('El nombre es requerido', 'error')
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
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setModal('form') }}>
          <Plus size={18} style={{ marginRight:8 }} /> Nueva Categoría
        </button>
      </div>

      <div className="grid-3">
        {loading ? <div className="loading">Cargando...</div> : items.map(c => (
          <div key={c.nombre} className="card cat-card">
            <div className="cat-header">
              <div className="cat-icon"><Folder size={20} /></div>
              <h3>{c.nombre}</h3>
              <div className="cat-actions">
                <button className="btn-icon" onClick={() => { setForm({ nombre: c.nombre }); setEditing(c.nombre); setModal('form') }}><Edit2 size={14} /></button>
                <button className="btn-icon delete" onClick={() => handleDelete(c.nombre)}><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="cat-stats">
              <div className="cat-stat">
                <span className="l"><Package size={12} /> Productos</span>
                <span className="v">{c.total_productos}</span>
              </div>
              <div className="cat-stat">
                <span className="l"><TrendingUp size={12} /> Valor</span>
                <span className="v">{fmtS(c.valor_inventario)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal === 'form' && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="btn-icon" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label>Nombre de la Categoría *</label>
              <input className="form-control" value={form.nombre} 
                onChange={e => setForm({ nombre: e.target.value })} 
                placeholder="Ej. Electrónica, Hogar..." disabled={saving} />
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
