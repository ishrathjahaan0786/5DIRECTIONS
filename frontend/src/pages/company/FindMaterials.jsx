import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyHeader } from '../../components/layout/Header'

const MATERIALS = [
  { id:1, name:'Titanium Ti-6Al-4V Grade 5', spec:'ASTM B265', suppliers:12, minPrice:'$38.00',  maxPrice:'$48.00', lead:'48–72h',  certs:['AS9100D','ISO 9001'] },
  { id:2, name:'Aluminum 7075-T6',           spec:'AMS 2770',  suppliers:18, minPrice:'$14.00',  maxPrice:'$22.00', lead:'24–48h',  certs:['ISO 9001','REACH'] },
  { id:3, name:'Nickel Alloy 625 (Inconel)', spec:'ASTM B443', suppliers:8,  minPrice:'$60.00',  maxPrice:'$80.00', lead:'72h–5d',  certs:['AS9100D'] },
  { id:4, name:'Carbon Fiber Tow 12K',       spec:'IEC 60068', suppliers:15, minPrice:'$28.00',  maxPrice:'$36.00', lead:'3–5 days',certs:['ISO 9001','REACH'] },
  { id:5, name:'Stainless Steel 316L',       spec:'ASTM A276', suppliers:24, minPrice:'$6.00',   maxPrice:'$12.00', lead:'24h',     certs:['ISO 9001'] },
  { id:6, name:'Copper Alloy C11000',        spec:'ASTM B187', suppliers:9,  minPrice:'$9.00',   maxPrice:'$15.00', lead:'48h',     certs:['RoHS','REACH'] },
]

export default function FindMaterials() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = MATERIALS.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.spec.toLowerCase().includes(query.toLowerCase())
  )

  const handleCompare = (material) => {
    navigate(`/company/compare-suppliers?material=${encodeURIComponent(material.name)}&spec=${encodeURIComponent(material.spec)}`)
  }

  const handleQuickOrder = (material) => {
    navigate(`/company/orders?action=new&material=${encodeURIComponent(material.name)}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <CompanyHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Header */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-ocean uppercase tracking-wider text-xs">Material Catalogue</span>
          </div>
          <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight mb-1">Find Raw Materials</h1>
          <p className="text-text-muted">Search our verified catalogue of 800+ industrial materials across 2,400+ global suppliers.</p>
        </section>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none">search</span>
            <input id="material-search" type="text" value={query} onChange={e => setQuery(e.target.value)}
              className="input pl-11" placeholder="Search by material name, spec, or grade…" />
          </div>
          <button className="btn-secondary gap-2">
            <span className="material-symbols-outlined text-lg">tune</span>Filters
          </button>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(m => (
            <div key={m.id}
              className={`card hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${selected===m.id ? 'ring-2 ring-crimson-red shadow-card-lg' : ''}`}
              onClick={() => setSelected(s => s===m.id ? null : m.id)}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-warm-cream flex items-center justify-center text-deep-navy group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-2xl">category</span>
                </div>
                <span className="badge-ocean">{m.suppliers} Suppliers</span>
              </div>
              <h3 className="font-bold text-deep-navy text-sm mb-1">{m.name}</h3>
              <p className="text-xs text-text-muted mb-3">{m.spec}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-text-muted">Price Range</span><div className="font-bold text-deep-navy">{m.minPrice} – {m.maxPrice}</div></div>
                <div><span className="text-text-muted">Lead Time</span><div className="font-bold text-deep-navy">{m.lead}</div></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {m.certs.map(c => <span key={c} className="badge-green">{c}</span>)}
              </div>

              {/* Action buttons on card */}
              <div className="mt-4 pt-4 border-t border-border-neutral flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCompare(m)
                  }}
                  className="btn-primary flex-1 text-xs py-2 gap-1.5 hover:bg-crimson-red/90 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">compare_arrows</span>Compare Suppliers
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleQuickOrder(m)
                  }}
                  title="Create Order"
                  className="btn-secondary text-xs py-2 px-3 hover:text-deep-navy"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-text-muted">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">search_off</span>
              No materials found for "{query}"
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
