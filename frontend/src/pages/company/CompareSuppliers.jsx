import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CompanyHeader } from '../../components/layout/Header'

const SUPPLIERS = [
  { id:1, name:'Titan Works GmbH',    country:'Germany', flag:'🇩🇪', rating:4.9, reliability:99.2, price:'$42.00',  lead:'48h',  stock:24000, certs:['AS9100D','ISO 9001'], backup:false, risk:'Low' },
  { id:2, name:'Vanguard Metals Inc', country:'USA',     flag:'🇺🇸', rating:4.7, reliability:98.5, price:'$38.50',  lead:'72h',  stock:18500, certs:['ISO 9001','NADCAP'],  backup:false, risk:'Low' },
  { id:3, name:'Apex Forge Ltd',      country:'Japan',   flag:'🇯🇵', rating:4.8, reliability:99.6, price:'$45.00',  lead:'5d',   stock:8200,  certs:['JIS Q 9100','AS9100D'],backup:true, risk:'Low' },
  { id:4, name:'MetaAlloy Spain',     country:'Spain',   flag:'🇪🇸', rating:4.4, reliability:96.8, price:'$35.00',  lead:'96h',  stock:12000, certs:['ISO 9001','REACH'],   backup:true, risk:'Moderate' },
]

export default function CompareSuppliers() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const materialParam = searchParams.get('material')
  const specParam = searchParams.get('spec')

  const [selected, setSelected] = useState([1, 2])

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 4 ? [...s, id] : s)
  }

  const compared = SUPPLIERS.filter(s => selected.includes(s.id))

  const handleSelectSupplier = (supplier) => {
    navigate(`/company/orders?action=new&supplier=${encodeURIComponent(supplier.name)}&material=${encodeURIComponent(materialParam || 'Titanium Ti-6Al-4V Grade 5')}&price=${encodeURIComponent(supplier.price)}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <CompanyHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Page Title & Back link */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/company/find-materials" className="text-xs font-semibold text-ocean-blue hover:text-deep-navy flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Catalogue
              </Link>
            </div>
            <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight mb-1">Compare Suppliers</h1>
            <p className="text-text-muted">Compare pricing, reliability, lead times, and certifications side-by-side.</p>
          </div>
          <span className="badge-ocean self-start text-xs font-semibold">
            {selected.length} of {SUPPLIERS.length} Selected
          </span>
        </section>

        {/* Material Context Banner if coming from catalogue */}
        {materialParam && (
          <div className="p-4 rounded-2xl bg-ocean-blue/10 border border-ocean-blue/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ocean-blue/20 text-ocean-blue flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">category</span>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-ocean-blue tracking-wider">Comparing Suppliers For:</span>
                <div className="text-lg font-extrabold text-deep-navy flex items-center gap-2">
                  <span>{materialParam}</span>
                  {specParam && <span className="text-xs font-medium text-text-muted font-mono bg-white/70 px-2 py-0.5 rounded-md">({specParam})</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelected([1, 2, 3, 4])}
              className="text-xs font-bold text-ocean-blue hover:text-deep-navy underline self-end sm:self-auto"
            >
              Select All 4 Suppliers
            </button>
          </div>
        )}

        {/* Supplier Selector Cards */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">
            Click to Select Suppliers (Up to 4)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPLIERS.map(s => {
              const isSelected = selected.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSelect(s.id)}
                  className={`card text-left group hover:-translate-y-1 transition-all duration-300 relative ${
                    isSelected ? 'ring-2 ring-crimson-red shadow-card-lg bg-pure-white' : 'opacity-70 hover:opacity-100 bg-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{s.flag}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected ? 'bg-crimson-red text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                  <div className="font-bold text-deep-navy text-base">{s.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{s.country}</div>
                  <div className="mt-2 flex items-center gap-1">
                    {Array.from({length:5}).map((_,i) => (
                      <span key={i} className={`material-symbols-outlined text-sm ${i < Math.floor(s.rating) ? 'text-amber-400' : 'text-border-neutral'}`}>star</span>
                    ))}
                    <span className="text-xs text-text-muted ml-1 font-semibold">{s.rating}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-neutral flex items-center justify-between text-xs">
                    <span className="text-text-muted">Unit Price</span>
                    <span className="font-extrabold text-crimson-red">{s.price}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Comparison Table */}
        {compared.length >= 2 && (
          <section className="animate-fade-in">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">
              Side-By-Side Comparison Matrix
            </h2>
            <div className="card p-0 overflow-hidden shadow-card-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-deep-navy text-white">
                      <th className="py-4 px-6 text-left text-sm font-semibold w-1/4">Evaluation Metric</th>
                      {compared.map(s => (
                        <th key={s.id} className="py-4 px-6 text-center text-sm font-semibold">
                          <div className="flex flex-col items-center gap-1">
                            <span>{s.flag} {s.name}</span>
                            <span className="text-[11px] font-normal text-white/60">{s.country}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:'Unit Price',    key:'price',       fmt: v => <span className="font-extrabold text-crimson-red text-base">{v}</span> },
                      { label:'Lead Time',     key:'lead',        fmt: v => <span className="font-semibold text-deep-navy">{v}</span> },
                      { label:'Reliability SLA',key:'reliability', fmt: v => <span className="badge-green font-bold">{v}% On-Time</span> },
                      { label:'Stock Avail.',  key:'stock',       fmt: v => <span>{v.toLocaleString()} units</span> },
                      { label:'Disruption Risk',key:'risk',       fmt: v => <span className={v==='Low' ? 'badge-ocean' : 'badge-amber'}>{v} Risk</span> },
                      { label:'Quality Certifications', key:'certs', fmt: v => <div className="flex flex-wrap gap-1 justify-center">{v.map(c=><span key={c} className="badge-ocean text-[11px]">{c}</span>)}</div> },
                      { label:'Supplier Tier', key:'backup',      fmt: v => v ? <span className="badge-amber">Backup Tier</span> : <span className="badge-green">Primary Tier</span> },
                    ].map((row, i) => (
                      <tr key={row.label} className={i%2===0 ? 'bg-background/40 hover:bg-background/80' : 'bg-pure-white hover:bg-background/40'}>
                        <td className="py-4 px-6 text-sm font-semibold text-text-muted">{row.label}</td>
                        {compared.map(s => (
                          <td key={s.id} className="py-4 px-6 text-sm text-deep-navy text-center">
                            {row.fmt(s[row.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-warm-cream/50 border-t border-border-neutral">
                      <td className="py-4 px-6 text-sm font-bold text-deep-navy">Procurement Action</td>
                      {compared.map(s => (
                        <td key={s.id} className="py-4 px-6 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelectSupplier(s)}
                            className="btn-primary text-xs py-2.5 px-5 shadow-sm hover:scale-105 transition-transform"
                          >
                            <span className="material-symbols-outlined text-sm">shopping_cart</span>
                            Select {s.name.split(' ')[0]}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>
        )}

        {compared.length < 2 && (
          <div className="card text-center py-12 text-text-muted">
            <span className="material-symbols-outlined text-5xl mb-3 block text-ocean-blue/40">compare_arrows</span>
            <div className="font-bold text-deep-navy text-base mb-1">Select at least 2 suppliers to compare</div>
            <p className="text-xs text-text-muted">Click the supplier cards above to toggle selection.</p>
          </div>
        )}
      </main>
    </div>
  )
}
