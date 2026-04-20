import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Plus, Edit2, Trash2, Truck, X, Package } from 'lucide-react'

const EMPTY = { nombre: '' }

export default function Proveedores({ showToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.suppliers.getAll()
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
        await api.suppliers.update(editing, form)
        showToast('Proveedor actualizado')
      } else {
        await api.suppliers.create(form)
        showToast('Proveedor creado')
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
    if (!confirm(`¿Eliminar proveedor "${name}"?`)) return
    try {
      await api.suppliers.delete(name)
      showToast('Proveedor eliminado')
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Proveedores</h1>
        <p>{items.length} proveedores registrados</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left"></div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setModal('form') }}>
          <Plus size={18} style={{ marginRight:8 }} /> Nuevo Proveedor
        </button>
      </div>

      <div className="grid-3">
        {loading ? <div className="loading">Cargando...</div> : items.map(s => (
          <div key={s.nombre} className="card cat-card">
            <div className="cat-header">
              <div className="cat-icon" style={{ background:'var(--amber-50)', color:'var(--amber-600)' }}><Truck size={20} /></div>
              <h3>{s.nombre}</h3>
              <div className="cat-actions">
                <button className="btn-icon" onClick={() => { setForm({ nombre: s.nombre }); setEditing(s.nombre); setModal('form') }}><Edit2 size={14} /></button>
                <button className="btn-icon delete" onClick={() => handleDelete(s.nombre)}><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="cat-stats">
              <div className="cat-stat">
                <span className="l"><Package size={12} /> Productos Activos</span>
                <span className="v">{s.productos_activos}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal === 'form' && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="btn-icon" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label>Nombre del Proveedor *</label>
              <input className="form-control" value={form.nombre} 
                onChange={e => setForm({ nombre: e.target.value })} 
                placeholder="Ej. Tech-Connect S.A., Distribuidora..." disabled={saving} />
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
