const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud')
  return data
}

// ── Productos ──
export const api = {
  products: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString()
      return request(`/products?${q}`)
    },
    getOne: (id)       => request(`/products/${id}`),
    create: (body)     => request('/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id)       => request(`/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    getAll: ()         => request('/categories'),
    create: (body)     => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (n, body)  => request(`/categories/${encodeURIComponent(n)}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (n)        => request(`/categories/${encodeURIComponent(n)}`, { method: 'DELETE' }),
  },
  suppliers: {
    getAll: ()         => request('/suppliers'),
    create: (body)     => request('/suppliers', { method: 'POST', body: JSON.stringify(body) }),
    update: (n, body)  => request(`/suppliers/${encodeURIComponent(n)}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (n)        => request(`/suppliers/${encodeURIComponent(n)}`, { method: 'DELETE' }),
  },
  dashboard: {
    kpis:         ()  => request('/dashboard/kpis'),
    topCategories:()  => request('/dashboard/top-categories'),
    distribution: ()  => request('/dashboard/inventory-distribution'),
    lowStock:     ()  => request('/dashboard/low-stock'),
  },
  reports: {
    inventario:  (cat) => `${BASE}/reports/inventario${cat ? '?categoria=' + encodeURIComponent(cat) : ''}`,
    estrategico: ()    => `${BASE}/reports/estrategico`,
  },
}
