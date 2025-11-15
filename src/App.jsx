import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import PropertyCard from './components/PropertyCard'
import ImageUploader from './components/ImageUploader'

function Header() {
  return (
    <header className="w-full py-6">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-600 tracking-tight">
          Loved Homes
        </h1>
        <a href="/LOVEDHOMES" className="text-xs text-sky-500 underline">LOVEDHOMES</a>
      </div>
    </header>
  )
}

export default function App() {
  const [properties, setProperties] = useState([])
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const navigate = useNavigate()

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/properties`)
    const data = await res.json()
    setProperties(data)
  }

  useEffect(() => { load() }, [])

  const addProperty = async () => {
    if (!name.trim()) return
    const res = await fetch(`${baseUrl}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, photo_url: photoUrl || null })
    })
    if (res.ok) {
      setName('')
      setPhotoUrl('')
      load()
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero with Spline cover */}
      <div className="relative h-[320px] sm:h-[380px]">
        <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/50 to-white pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sky-600 text-sm uppercase tracking-widest">Property Management</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-sky-700">Loved Homes</h2>
            <p className="mt-2 text-sky-600">Organizza e gestisci le tue case vacanza</p>
          </div>
        </div>
      </div>

      <Header />

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Add property */}
        <div className="mb-8 p-4 border rounded-xl bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome casa"
              className="flex-1 border rounded-md px-3 py-2"
            />
            <div className="flex items-center gap-2">
              <ImageUploader onUploaded={setPhotoUrl} label={photoUrl ? 'Foto selezionata' : 'Carica foto'} />
              <button onClick={addProperty} className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600">+
              </button>
            </div>
          </div>
          {photoUrl && (
            <div className="mt-3">
              <img src={photoUrl} alt="Preview" className="h-40 rounded-md object-cover" />
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-4">
          {properties.length === 0 ? (
            <p className="text-gray-500">Aggiungi la tua prima casa con il pulsante +</p>
          ) : (
            properties.map(p => (
              <PropertyCard key={p.id} property={p} onClick={() => navigate(`/property/${p.id}`)} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
