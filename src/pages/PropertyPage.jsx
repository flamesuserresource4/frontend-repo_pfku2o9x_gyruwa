import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Checklist from '../components/Checklist'

export default function PropertyPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [currentParent, setCurrentParent] = useState(null)
  const [path, setPath] = useState([]) // breadcrumbs of folders
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/properties`)
    const list = await res.json()
    const p = list.find(x => x.id === id)
    setProperty(p || null)
  }
  useEffect(() => { load() }, [id])

  const handleNavigate = (parentId, title) => {
    if (parentId === null) {
      setCurrentParent(null)
      setPath([])
    } else {
      setCurrentParent(parentId)
      if (title) setPath(prev => [...prev, { id: parentId, title }])
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/')} className="text-sky-600">← Back</button>
          <h1 className="text-xl font-semibold text-sky-700">{property?.name || 'Casa'}</h1>
          <div />
        </div>

        {property?.photo_url && (
          <img src={property.photo_url} alt={property.name} className="w-full h-56 object-cover rounded-xl mb-6" />
        )}

        <div className="p-4 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold text-sky-600 mb-4">Checklist</h2>
          <Checklist propertyId={id} parentId={currentParent} path={path} onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  )
}
