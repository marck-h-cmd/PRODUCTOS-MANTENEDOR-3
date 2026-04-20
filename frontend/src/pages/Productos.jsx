import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import { 
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, 
  Package, AlertTriangle, CheckCircle2, MoreHorizontal, X
} from 'lucide-react'

const EMPTY = {
  sku:'', nombre:'', descripcion:'', categoria:'', precio_compra:'',
  precio_venta:'', stock_actual:'', stock_minimo:'', proveedor:'',
}

const fmtS = n => 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2 })
const PAGE_SIZE = 8

export default function Productos({ showToast }) {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [total, setTotal]         = useState(0)
  
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)

  const [modal, setModal]         = useState(null)  // 'create' | 'edit' | 'delete'
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [errors, setErrors]       = useState({})
  const [saving, setSaving]       = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [pData, cData, sData] = await Promise.all([
        api.products.getAll({ search, categoria: filterCat, page, limit: PAGE_SIZE }),
        api.categories.getAll(),
        api.suppliers.getAll()
      ])
      setProducts(pData.data)
      setTotal(pData.total)
      setCategories(cData)
      setSuppliers(sData)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search, filterCat, page])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const openCreate = () => { setForm(EMPTY); setErrors({}); setEditing(null); setModal('create') }
  const openEdit   = (p)  => { setForm({ ...p }); setErrors({}); setEditing(p.id); setModal('edit') }
  const openDelete = (p)  => { setEditing(p); setModal('delete') }

  const validate = () => {
    const e = {}
    if (!form.sku)           e.sku = 'Requerido'
    if (!form.nombre)        e.nombre = 'Requerido'
    if (!form.categoria)     e.categoria = 'Requerida'
    if (!form.proveedor)     e.proveedor = 'Requerido'
    if (form.precio_compra === '' || form.precio_compra < 0) e.precio_compra = 'Inválido'
    if (form.precio_venta === '' || form.precio_venta < 0)  e.precio_venta = 'Inválido'
    if (form.stock_actual === '' || form.stock_actual < 0)  e.stock_actual = 'Inválido'
    if (form.stock_minimo === '' || form.stock_minimo < 0)  e.stock_minimo = 'Inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        await api.products.update(editing, form)
        showToast('Producto actualizado correctamente')
      } else {
        await api.products.create(form)
        showToast('Producto creado correctamente')
      }
      setModal(null)
      loadData()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.products.delete(editing.id)
      showToast('Producto eliminado', 'success')
      setModal(null)
      loadData()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const f = (k) => ({
    value: form[k] ?? '',
    className: `form-control${errors[k] ? ' error' : ''}`,
    onChange: e => setForm(v => ({ ...v, [k]: e.target.value })),
  })

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <p>{total} productos registrados</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input className="search-input" placeholder="Buscar por nombre, SKU o categoría…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <select className="select-input" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1) }}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} style={{ marginRight:8 }} /> Nuevo Producto
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div className="table-wrapper">
          <table className={loading ? 'loading-table' : ''}>
            <thead>
              <tr>
                <th>SKU</th><th>Nombre</th><th>Categoría</th><th>Proveedor</th>
                <th>Stock</th><th>P. Compra</th><th>P. Venta</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && products.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:48, color:'var(--gray-500)' }}>
                  No se encontraron productos
                </td></tr>
              )}
              {products.map(p => {
                const lowStock = p.stock_actual < p.stock_minimo
                return (
                  <tr key={p.id} onClick={() => openEdit(p)}>
                    <td><code style={{ fontFamily:'monospace', fontSize:12, background:'#f1f5f9', padding:'2px 4px', borderRadius:4 }}>{p.sku}</code></td>
                    <td style={{ fontWeight:500 }}>{p.nombre}</td>
                    <td><span className="badge badge-blue">{p.categoria}</span></td>
                    <td style={{ color:'var(--gray-500)', fontSize:12 }}>{p.proveedor}</td>
                    <td style={{ fontWeight:600, color: lowStock ? 'var(--red-600)' : 'inherit' }}>
                      {p.stock_actual}
                    </td>
                    <td>{fmtS(p.precio_compra)}</td>
                    <td>{fmtS(p.precio_venta)}</td>
                    <td>
                      <span className={`badge ${lowStock ? 'badge-red' : 'badge-green'}`} style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                        {lowStock ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                        {lowStock ? 'Bajo stock' : 'Normal'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn-icon" title="Editar" onClick={() => openEdit(p)}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" title="Eliminar" onClick={() => openDelete(p)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="pagination" style={{ padding:'12px 20px', borderTop:'1px solid var(--gray-200)' }}>
          <span style={{ fontSize:13, color:'var(--gray-500)' }}>
            Mostrando {total === 0 ? 0 : (page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, total)} de {total}
          </span>
          <div className="pagination-btns">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1 || loading}>
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
               let n = i + 1;
               if (totalPages > 5 && page > 3) n = page - 3 + i + 1;
               if (n > totalPages) return null;
               return (
                <button key={n} className={`page-btn${page===n?' active':''}`} onClick={() => setPage(n)} disabled={loading}>{n}</button>
               )
            })}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages||totalPages===0 || loading}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div className="modal-icon-bg"><Package size={20} /></div>
                <h2>{modal === 'create' ? 'Nuevo Producto' : 'Editar Producto'}</h2>
              </div>
              <button className="btn-icon" onClick={() => setModal(null)} disabled={saving}><X size={20} /></button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>SKU *</label>
                <input {...f('sku')} placeholder="TEC-001" disabled={saving} />
                {errors.sku && <span className="form-error">{errors.sku}</span>}
              </div>
              <div className="form-group">
                <label>Nombre *</label>
                <input {...f('nombre')} placeholder="Nombre del producto" disabled={saving} />
                {errors.nombre && <span className="form-error">{errors.nombre}</span>}
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <select {...f('categoria')} disabled={saving}>
                  <option value="">Seleccionar…</option>
                  {categories.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                </select>
                {errors.categoria && <span className="form-error">{errors.categoria}</span>}
              </div>
              <div className="form-group">
                <label>Proveedor *</label>
                <select {...f('proveedor')} disabled={saving}>
                  <option value="">Seleccionar…</option>
                  {suppliers.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
                </select>
                {errors.proveedor && <span className="form-error">{errors.proveedor}</span>}
              </div>
              <div className="form-group">
                <label>Precio Compra (S/) *</label>
                <input {...f('precio_compra')} type="number" min="0" step="0.01" disabled={saving} />
                {errors.precio_compra && <span className="form-error">{errors.precio_compra}</span>}
              </div>
              <div className="form-group">
                <label>Precio Venta (S/) *</label>
                <input {...f('precio_venta')} type="number" min="0" step="0.01" disabled={saving} />
                {errors.precio_venta && <span className="form-error">{errors.precio_venta}</span>}
              </div>
              <div className="form-group">
                <label>Stock Actual *</label>
                <input {...f('stock_actual')} type="number" min="0" disabled={saving} />
                {errors.stock_actual && <span className="form-error">{errors.stock_actual}</span>}
              </div>
              <div className="form-group">
                <label>Stock Mínimo *</label>
                <input {...f('stock_minimo')} type="number" min="0" disabled={saving} />
                {errors.stock_minimo && <span className="form-error">{errors.stock_minimo}</span>}
              </div>
              <div className="form-group full">
                <label>Descripción</label>
                <textarea {...f('descripcion')} rows={2} placeholder="Descripción opcional" disabled={saving} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)} disabled={saving}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : modal === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {modal === 'delete' && editing && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
            <div className="confirm-box">
              <div className="confirm-icon" style={{ background:'var(--red-50)', color:'var(--red-600)' }}><Trash2 size={32} /></div>
              <h3>¿Eliminar producto?</h3>
              <p>¿Estás seguro de que deseas eliminar <strong>{editing.nombre}</strong>?<br />Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent:'center' }}>
              <button className="btn btn-secondary" onClick={() => setModal(null)} disabled={saving}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
