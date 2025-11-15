import React, { useEffect, useState } from 'react'

function ItemRow({ item, onAdd, onRename, onDelete, onOpen }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {item.is_folder ? (
          <button onClick={onOpen} className="text-sky-600 underline">
            {item.title}
          </button>
        ) : (
          <span>{item.title}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onRename} className="text-sky-600 text-sm">Rinomina</button>
        <button onClick={onDelete} className="text-red-500 text-sm">Elimina</button>
      </div>
    </div>
  )
}

export default function Checklist({ propertyId, parentId = null, path = [], onNavigate }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [isFolder, setIsFolder] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadItems = async () => {
    setLoading(true)
    try {
      const url = new URL(`${baseUrl}/api/properties/${propertyId}/items`)
      if (parentId) url.searchParams.set('parent_id', parentId)
      const res = await fetch(url.toString())
      const data = await res.json()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, parentId])

  const addItem = async () => {
    if (!title.trim()) return
    const res = await fetch(`${baseUrl}/api/properties/${propertyId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, is_folder: isFolder, parent_id: parentId }),
    })
    if (res.ok) {
      setTitle('')
      setIsFolder(false)
      loadItems()
    }
  }

  const renameItem = async (id) => {
    const newTitle = prompt('Nuovo nome:')
    if (!newTitle) return
    await fetch(`${baseUrl}/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
    loadItems()
  }

  const deleteItem = async (id) => {
    if (!confirm('Eliminare questa voce e le sue sotto-voci?')) return
    await fetch(`${baseUrl}/api/items/${id}`, { method: 'DELETE' })
    loadItems()
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500">
        <button onClick={() => onNavigate(null)} className="text-sky-600">Radice</button>
        {path.map((p, idx) => (
          <span key={p.id}>
            {' / '}
            <button onClick={() => onNavigate(p.id)} className="text-sky-600">{p.title}</button>
          </span>
        ))}
      </div>

      {/* Add */}
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nuova voce"
          className="flex-1 border rounded-md px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={isFolder} onChange={(e) => setIsFolder(e.target.checked)} />
          Cartella
        </label>
        <button onClick={addItem} className="px-3 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600">+
        </button>
      </div>

      {/* List */}
      <div className="divide-y">
        {loading ? (
          <p>Caricamento...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Nessuna voce</p>
        ) : (
          items.map((it) => (
            <ItemRow
              key={it.id}
              item={it}
              onOpen={() => it.is_folder && onNavigate(it.id, it.title)}
              onRename={() => renameItem(it.id)}
              onDelete={() => deleteItem(it.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
