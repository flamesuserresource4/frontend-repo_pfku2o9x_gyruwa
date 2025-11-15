import React from 'react'

export default function PropertyCard({ property, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border rounded-xl p-4 hover:shadow-md transition bg-white"
    >
      <h3 className="text-lg font-semibold text-sky-600 mb-3">{property.name}</h3>
      {property.photo_url ? (
        <img src={property.photo_url} alt={property.name} className="w-full h-56 object-cover rounded-lg" />
      ) : (
        <div className="w-full h-56 bg-sky-50 border border-dashed rounded-lg flex items-center justify-center text-sky-400">
          Nessuna foto
        </div>
      )}
    </button>
  )
}
