import React, { useRef, useState } from 'react'

export default function ImageUploader({ onUploaded, label = 'Carica foto' }) {
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${baseUrl}/api/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        onUploaded?.(data.url)
      } else {
        alert(data.detail || 'Errore caricamento')
      }
    } catch (e) {
      alert('Errore caricamento immagine')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 text-sm"
        disabled={loading}
      >
        {loading ? 'Caricamento...' : label}
      </button>
    </div>
  )
}
