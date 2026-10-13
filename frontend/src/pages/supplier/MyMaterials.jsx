import { useState } from 'react'
import { SupplierHeader } from '../../components/layout/Header'

const MATERIALS = [
  { id:1, abbr:'Ti', name:'Titanium Ti-6Al-4V Grade 5', sku:'TIT-GR5-408', form:'Hot-Rolled Billet', qty:8500, unit:'units', allocated:0, price:42.00, lead:'48 hours', cert:'Verified AS9100D', certColor:'text-emerald-700 bg-emerald-100', status:'active' },
  { id:2, abbr:'Ni', name:'Nickel Alloy 625 (Inconel)',  sku:'NIC-625-780', form:'Vacuum Arc Remelt',  qty:4200, unit:'units', allocated:800, price:68.50, lead:'72 hours', cert:'Verified ISO 9001', certColor:'text-emerald-700 bg-emerald-100', status:'active' },
  { id:3, abbr:'CF', name:'Carbon Fiber Tow 12K',         sku:'CFT-12K-002', form:'Continuous Filament',qty:12000,unit:'kg',   allocated:2500,price:31.20, lead:'5 Days',  cert:'Pending REACH',   certColor:'text-amber-700 bg-amber-100',  status:'pending' },
]

export default function SupplierMaterials() {
  const [materials, setMaterials] = useState(MATERIALS)
  const [editing, setEditing] = useState(null)
  const [editQty, setEditQty] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newMat, setNewMat] = useState({ name:'', sku:'', qty:'', price:'', lead:'', cert:'' })

  const startEdit = (m) => { setEditing(m.id); setEditQty(m.qty); setEditPrice(m.price) }
  const saveEdit = (id) => {
    setMaterials(ms => ms.map(m => m.id===id ? {...m, qty:+editQty, price:+editPrice} : m))
    setEditing(null)
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <SupplierHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight mb-1">My Materials</h1>
            <p className="text-text-muted">Manage your certified warehouse stock in real time.</p>
          </div>
          <button id="add-material-btn" onClick={() => setShowAdd(true)} className="btn-primary gap-2 self-start">
            <span className="material-symbols-outlined text-xl">add</span>Add Material
          </button>
        </section>

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total Materials', value:materials.length, icon:'inventory_2', color:'bg-warm-cream' },
            { label:'Total Stock',  value:materials.reduce((a,m) => a+m.qty, 0).toLocaleString()+' units', icon:'warehouse', color:'bg-ocean-blue/10' },
            { label:'Allocated',  value:materials.reduce((a,m) => a+m.allocated, 0).toLocaleString()+' units', icon:'assignment_turned_in', color:'bg-crimson-red/10' },
          ].map(k => (
            <div key={k.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${k.color}`}>
                <span className="material-symbols-outlined text-deep-navy text-2xl">{k.icon}</span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-deep-navy">{k.value}</div>
                <div className="text-xs text-text-muted">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Materials Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/80 text-text-muted text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Material</th>
                  <th className="py-4 px-6">Stock / Allocated</th>
                  <th className="py-4 px-6">Unit Price</th>
                  <th className="py-4 px-6">Lead Time</th>
                  <th className="py-4 px-6">Certificate</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m, i) => (
                  <tr key={m.id} className={`${i%2===1?'bg-background/30':''} hover:bg-warm-cream/20 transition-colors`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-bold text-deep-navy text-xs shrink-0">{m.abbr}</div>
                        <div>
                          <div className="font-bold text-sm text-deep-navy">{m.name}</div>
                          <div className="text-xs text-text-muted">{m.sku} · {m.form}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {editing === m.id ? (
                        <input type="number" value={editQty} onChange={e=>setEditQty(e.target.value)}
                          className="input w-28 py-1 text-sm" />
                      ) : (
                        <div>
                          <div className="font-bold text-sm">{m.qty.toLocaleString()} {m.unit}</div>
                          <div className="text-xs text-text-muted">Allocated: {m.allocated.toLocaleString()}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {editing === m.id ? (
                        <input type="number" value={editPrice} onChange={e=>setEditPrice(e.target.value)}
                          className="input w-24 py-1 text-sm" />
                      ) : (
                        <span className="font-bold text-sm">${m.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-text-muted">{m.lead}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${m.certColor}`}>{m.cert}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        {editing === m.id ? (
                          <>
                            <button onClick={() => saveEdit(m.id)} className="btn-primary text-xs py-1.5 px-3">Save</button>
                            <button onClick={() => setEditing(null)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(m)} className="btn-secondary text-xs py-1.5 px-3">Update Stock</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Material Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/50 backdrop-blur-sm p-4" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
            <div className="bg-pure-white rounded-2xl shadow-card-lg p-6 w-full max-w-md animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-xl text-deep-navy">Add New Material</h3>
                <button onClick={() => setShowAdd(false)} className="text-text-muted hover:text-deep-navy">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <form onSubmit={e => { e.preventDefault(); setMaterials(ms => [...ms, { id: Date.now(), abbr:newMat.name.slice(0,2).toUpperCase(), ...newMat, qty:+newMat.qty, price:+newMat.price, allocated:0, unit:'units', certColor:'text-amber-700 bg-amber-100', status:'pending' }]); setShowAdd(false) }} className="flex flex-col gap-4">
                {[['name','Material Name','Titanium Ti-6Al-4V'],['sku','SKU / Grade','TIT-GR5-408'],['qty','Available Quantity','8500'],['price','Unit Price ($)','42.00'],['lead','Lead Time','48 hours'],['cert','Certificate Status','ISO 9001']].map(([f,l,p]) => (
                  <div key={f}>
                    <label className="block text-xs font-semibold text-deep-navy mb-1">{l}</label>
                    <input className="input text-sm" placeholder={p} value={newMat[f]} onChange={e => setNewMat(n=>({...n,[f]:e.target.value}))} required />
                  </div>
                ))}
                <button type="submit" className="btn-primary w-full mt-1">Add Material</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
