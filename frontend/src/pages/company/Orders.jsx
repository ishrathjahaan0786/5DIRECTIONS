import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CompanyHeader } from '../../components/layout/Header'

const INITIAL_ORDERS = [
  { id:'PO-2024-001', supplier:'Titan Works GmbH',    material:'Ti-6Al-4V Grade 5', qty:'5,000 units',  value:'$210,000', status:'In Transit',  date:'2026-10-12', stage:3 },
  { id:'PO-2024-002', supplier:'Vanguard Metals Inc',  material:'Aluminum 7075-T6',  qty:'3,500 units',  value:'$68,250',  status:'Processing',  date:'2026-10-13', stage:1 },
  { id:'PO-2024-003', supplier:'Apex Forge Ltd',       material:'Carbon Fiber 12K',  qty:'2,000 kg',     value:'$62,400',  status:'Delivered',   date:'2026-10-10', stage:4 },
  { id:'PO-2024-004', supplier:'MetaAlloy Spain',      material:'Stainless Steel 316L',qty:'8,000 units',value:'$88,000',  status:'Pending',     date:'2026-10-13', stage:0 },
]

const STATUS_COLORS = {
  'Pending':    'text-text-muted bg-surface-container',
  'Processing': 'text-amber-700 bg-amber-100',
  'In Transit': 'text-ocean-blue bg-ocean-blue/10',
  'Delivered':  'text-emerald-700 bg-emerald-100',
}

const STAGES = ['Pending','Accepted','Preparing','Dispatched','Delivered']

export default function CompanyOrders() {
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Form state for new order modal
  const [newSupplier, setNewSupplier] = useState('Titan Works GmbH')
  const [newMaterial, setNewMaterial] = useState('Nickel Alloy 625 (Inconel)')
  const [newQty, setNewQty] = useState('2,500 units')
  const [newValue, setNewValue] = useState('$150,000')

  useEffect(() => {
    const action = searchParams.get('action')
    const supplierParam = searchParams.get('supplier')
    const materialParam = searchParams.get('material')
    const priceParam = searchParams.get('price')

    if (action === 'new' && supplierParam) {
      const newPOId = `PO-2024-00${orders.length + 1}`
      const createdOrder = {
        id: newPOId,
        supplier: supplierParam,
        material: materialParam || 'Custom Specification Material',
        qty: '3,000 units',
        value: priceParam ? `$${(parseFloat(priceParam.replace(/[^0-9.]/g,'')) * 3000).toLocaleString()}` : '$126,000',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        stage: 0
      }
      setOrders(prev => [createdOrder, ...prev.filter(x => x.id !== newPOId)])
      setExpanded(newPOId)
      setToast(`Purchase Order ${newPOId} generated with ${supplierParam}!`)
    }
  }, [searchParams])

  const handleCreateOrder = (e) => {
    e.preventDefault()
    const newPOId = `PO-2024-00${orders.length + 1}`
    const created = {
      id: newPOId,
      supplier: newSupplier,
      material: newMaterial,
      qty: newQty,
      value: newValue,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      stage: 0
    }
    setOrders(prev => [created, ...prev])
    setExpanded(newPOId)
    setModalOpen(false)
    setToast(`Purchase Order ${newPOId} submitted successfully!`)
  }

  const filters = ['All','Pending','Processing','In Transit','Delivered']
  const shown = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <CompanyHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Toast */}
        {toast && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-card animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <span className="font-semibold">{toast}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-emerald-600 hover:text-emerald-900">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight mb-1">My Orders</h1>
            <p className="text-text-muted">Track and manage all your purchase orders across active suppliers.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary gap-2 self-start shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>New Order
          </button>
        </section>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-surface-container w-fit rounded-xl">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f ? 'bg-pure-white text-deep-navy shadow-card' : 'text-text-muted hover:text-deep-navy'
              }`}>{f}</button>
          ))}
        </div>

        {/* Orders list */}
        <div className="flex flex-col gap-4">
          {shown.map(o => (
            <div key={o.id} className="card hover:shadow-card-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(e => e===o.id ? null : o.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-deep-navy text-xl">receipt_long</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-deep-navy">{o.id}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{o.supplier} · {o.material}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-extrabold text-deep-navy text-base">{o.value}</div>
                    <div className="text-xs text-text-muted">{o.qty}</div>
                  </div>
                  <span className={`material-symbols-outlined text-text-muted transition-transform ${expanded===o.id ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
              </div>

              {/* Fulfilment Tracker */}
              {expanded === o.id && (
                <div className="mt-6 pt-6 border-t border-border-neutral animate-fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Live Fulfilment Stepper</h4>
                  <div className="flex items-center justify-between relative mb-6">
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-surface-container -translate-y-1/2 -z-0" />
                    {STAGES.map((s, idx) => (
                      <div key={s} className="flex flex-col items-center gap-2 z-10 bg-[#FFFCF7] px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          idx <= o.stage ? 'bg-crimson-red text-white shadow-sm' : 'bg-surface-container text-text-muted'
                        }`}>
                          {idx <= o.stage ? '✓' : idx + 1}
                        </div>
                        <span className="text-[11px] font-medium text-text-muted">{s}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => alert(`Tracking telemetry link copied for ${o.id}`)}
                      className="btn-secondary text-xs py-2 px-3 gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">share</span>Share Tracking
                    </button>
                    <button
                      onClick={() => alert(`Carrier telemetry: Order ${o.id} is on schedule via DHL Freight.`)}
                      className="btn-primary text-xs py-2 px-3 gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">gps_fixed</span>Carrier Telemetry
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* New Order Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-pure-white rounded-2xl shadow-card-lg max-w-md w-full p-6 border border-deep-navy/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-deep-navy">Issue New Purchase Order</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-deep-navy">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-deep-navy mb-1">Select Supplier</label>
                <select value={newSupplier} onChange={e => setNewSupplier(e.target.value)} className="input text-xs">
                  <option value="Titan Works GmbH">Titan Works GmbH (Germany)</option>
                  <option value="Vanguard Metals Inc">Vanguard Metals Inc (USA)</option>
                  <option value="Apex Forge Ltd">Apex Forge Ltd (Japan)</option>
                  <option value="MetaAlloy Spain">MetaAlloy Spain (Spain)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-deep-navy mb-1">Material Name & Grade</label>
                <input type="text" value={newMaterial} onChange={e => setNewMaterial(e.target.value)} className="input text-xs" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy mb-1">Quantity</label>
                  <input type="text" value={newQty} onChange={e => setNewQty(e.target.value)} className="input text-xs" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-deep-navy mb-1">Total Value</label>
                  <input type="text" value={newValue} onChange={e => setNewValue(e.target.value)} className="input text-xs" required />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button type="submit" className="btn-primary flex-1 py-2 text-xs">Generate Purchase Order</button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-2 px-3 text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
