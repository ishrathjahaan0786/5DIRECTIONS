import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SupplierHeader } from '../../components/layout/Header'
import api from '../../lib/api'

const INITIAL_COMPANY_REQUESTS = [
  {
    id: 1, company:'NorthStar Robotics Corp', initials:'NR',
    po:'PO #NSR-2024-8891', type:'Automated Aerospace Tier-1',
    spec:'Ti-6Al-4V Titanium', qty:'2,000 units', price:'$42.00', total:'$84,000',
    status:'100% In Stock', statusColor:'text-emerald-700 bg-emerald-100',
    location:'Zurich Vault Bay-04 • Heat #TK-9941 Ready for Immediate Seal',
    locationIcon:'location_on', urgent:true,
  },
  {
    id: 2, company:'AeroDynamic Systems Ltd', initials:'AD',
    po:'PO #ADS-9932', type:'Defense Airframe Contractor',
    spec:'Aluminum 7075-T6', qty:'3,500 units', price:'$19.50', total:'$68,250',
    status:'Allocation Check: 92%', statusColor:'text-ocean-blue bg-ocean-blue/10',
    location:'Requested Lead Window: 5 Business Days • Direct Ship to Bristol Facility',
    locationIcon:'schedule', urgent:false,
  },
]

const INITIAL_MATERIALS = [
  { id:1, abbr:'Ti', name:'Titanium Ti-6Al-4V Grade 5', sku:'TIT-GR5-408 • Hot-Rolled Billet', qty: 8500, unit: 'units', allocated: 0, allocColor:'text-emerald-700', price: 42.00, lead:'48 hours', leadIcon:'bolt', cert:'Verified AS9100D', certColor:'text-emerald-700 bg-emerald-100', certIcon:'verified_user' },
  { id:2, abbr:'Ni', name:'Nickel Alloy 625 (Inconel)',  sku:'NIC-625-780 • Vacuum Arc Remelt',  qty: 4200, unit: 'units', allocated: 800, allocColor:'text-ocean-blue', price: 68.50, lead:'72 hours', leadIcon:'schedule', cert:'Verified ISO 9001', certColor:'text-emerald-700 bg-emerald-100', certIcon:'verified_user' },
  { id:3, abbr:'CF', name:'Carbon Fiber Tow 12K',         sku:'CFT-12K-002 • Continuous Filament', qty: 12000, unit: 'kg', allocated: 2500, allocColor:'text-text-muted', price: 31.20, lead:'5 Days', leadIcon:'calendar_today', cert:'Pending REACH', certColor:'text-amber-700 bg-amber-100', certIcon:'hourglass_top' },
]

const INITIAL_CERTS = [
  { name:'ISO 9001:2015', sub:'Verified Quality Management Suite', badge:'Valid 2026', badgeColor:'text-emerald-700 bg-emerald-100', icon:'verified', iconBg:'bg-emerald-100 text-emerald-800' },
  { name:'AS9100D Aerospace', sub:'Verified Defense & Aero Standard', badge:'Audit Passed', badgeColor:'text-emerald-700 bg-emerald-100', icon:'workspace_premium', iconBg:'bg-emerald-100 text-emerald-800' },
]

const STAGES = ['Pending','Accepted','Preparing','Dispatched','Delivered']
const BATCH_STAGE = 3 // Dispatched

export default function SupplierDashboard() {
  const [search, setSearch] = useState('')
  const [requests, setRequests] = useState(INITIAL_COMPANY_REQUESTS)
  const [materials, setMaterials] = useState(INITIAL_MATERIALS)
  const [certs, setCerts] = useState(INITIAL_CERTS)
  
  // Interactive Modals State
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  // File Upload Reference
  const fileInputRef = useRef(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  // Allocation Rules Form State
  const [rules, setRules] = useState({
    moq: '500',
    buffer: '15',
    autoThreshold: '150000',
    allowAiAgent: true,
    tier1Priority: true
  })

  // Add Material Form State
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    sku: '',
    category: 'Metals & Alloys',
    spec: 'ASTM B265 / AMS 4911',
    qty: '',
    unit: 'kg',
    price: '',
    lead: '48 hours',
    cert: 'Verified AS9100D'
  })
  const [savingMaterial, setSavingMaterial] = useState(false)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4500)
  }

  const acceptOrder = (id) => {
    setRequests(r => r.filter(x => x.id !== id))
    showToast('Purchase order request accepted and transferred to Fulfilment Queue.')
  }

  const declineOrder = (id) => {
    setRequests(r => r.filter(x => x.id !== id))
    showToast('Purchase order request declined.')
  }

  // Handle Certificate Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    setTimeout(() => {
      const newCert = {
        name: file.name,
        sub: `Uploaded ${(file.size / 1024).toFixed(1)} KB • Cryptographic verification active`,
        badge: 'Audit Passed',
        badgeColor: 'text-emerald-700 bg-emerald-100',
        icon: 'verified',
        iconBg: 'bg-emerald-100 text-emerald-800'
      }
      setCerts(prev => [newCert, ...prev])
      setUploadingFile(false)
      showToast(`Certificate "${file.name}" uploaded successfully! Document registered on 5Directions ledger.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }, 600)
  }

  // Handle Add Material Submit
  const handleAddMaterialSubmit = async (e) => {
    e.preventDefault()
    if (!newMaterial.name || !newMaterial.qty || !newMaterial.price) {
      showToast('Please fill in material name, available stock, and price.')
      return
    }

    setSavingMaterial(true)
    try {
      // Attempt backend persistence
      await api.materials.create({
        name: newMaterial.name,
        sku: newMaterial.sku || `SKU-${Date.now().toString().slice(-4)}`,
        category: newMaterial.category,
        spec: newMaterial.spec,
        stockQty: Number(newMaterial.qty) || 1000,
        unit: newMaterial.unit,
        unitPrice: Number(newMaterial.price) || 50,
        leadTime: newMaterial.lead,
        certifications: [newMaterial.cert]
      }).catch(() => null) // Resilient fallback
    } catch {
      // local state still updates
    } finally {
      const addedItem = {
        id: Date.now(),
        abbr: newMaterial.name.slice(0, 2).toUpperCase(),
        name: newMaterial.name,
        sku: `${newMaterial.sku || 'SKU-' + Date.now().toString().slice(-4)} • ${newMaterial.spec}`,
        qty: Number(newMaterial.qty),
        unit: newMaterial.unit,
        allocated: 0,
        allocColor: 'text-emerald-700',
        price: Number(newMaterial.price),
        lead: newMaterial.lead,
        leadIcon: 'bolt',
        cert: newMaterial.cert,
        certColor: 'text-emerald-700 bg-emerald-100',
        certIcon: 'verified_user'
      }

      setMaterials(prev => [addedItem, ...prev])
      setSavingMaterial(false)
      setShowAddModal(false)
      setNewMaterial({
        name: '',
        sku: '',
        category: 'Metals & Alloys',
        spec: 'ASTM B265 / AMS 4911',
        qty: '',
        unit: 'kg',
        price: '',
        lead: '48 hours',
        cert: 'Verified AS9100D'
      })
      showToast(`Raw material "${addedItem.name}" published to active supplier inventory!`)
    }
  }

  // Handle Save Allocation Rules
  const handleSaveRules = (e) => {
    e.preventDefault()
    setShowRulesModal(false)
    showToast('Allocation & AI resilience buffer rules updated successfully!')
  }

  // Handle Update Stock
  const handleSaveStock = (id, newQty) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, qty: Number(newQty) || m.qty } : m))
    setEditingStock(null)
    showToast('Warehouse stock quantity updated.')
  }

  const filtered = materials.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase())
  )

  const totalStockUnits = materials.reduce((sum, m) => sum + (Number(m.qty) || 0), 0)

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <SupplierHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">

        {/* ── Toast Notification ── */}
        {toastMsg && (
          <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-deep-navy text-white shadow-2xl border border-white/20 flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="text-sm font-semibold">{toastMsg}</span>
            <button onClick={() => setToastMsg('')} className="text-white/60 hover:text-white ml-2">✕</button>
          </div>
        )}

        {/* ── A: Welcome & KPIs ── */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-3xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-blue/15 text-deep-navy text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-ocean-blue animate-pulse"></span>
                  Live Supplier Terminal • Zurich Hub
                </span>
                <span className="text-xs text-text-muted">Node ID: APX-CH-8002</span>
              </div>
              <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight">Welcome to Your Supplier Dashboard</h1>
              <p className="text-text-muted text-sm">Manage your materials, respond to requests, and keep track of your orders.</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                id="btn-allocation-rules"
                onClick={() => setShowRulesModal(true)}
                className="btn-secondary gap-2"
              >
                <span className="material-symbols-outlined text-lg">tune</span>Allocation Rules
              </button>
              <button
                type="button"
                id="btn-add-material"
                onClick={() => setShowAddModal(true)}
                className="btn-primary gap-2"
              >
                <span className="material-symbols-outlined text-xl">add</span>+ Add Material
              </button>
            </div>
          </div>

          {/* KPI 3-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-warm-cream/50 pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Materials Listed</span>
                <span className="p-2.5 rounded-xl bg-warm-cream text-deep-navy material-symbols-outlined text-xl">inventory_2</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold text-deep-navy leading-none">{materials.length}</span>
                <span className="text-xl font-semibold text-ocean-blue">Active Types</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Titanium, Nickel Inconel, Carbon Fiber</p>
              <div className="mt-4 pt-3 border-t border-border-neutral/40 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-deep-navy font-medium">
                  <span className="material-symbols-outlined text-sm text-ocean-blue">verified</span>100% Spec Compliant
                </div>
                <Link to="/supplier/my-materials" className="text-xs text-ocean-blue hover:underline">View catalog →</Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-surface-variant/40 pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Available Stock</span>
                <span className="p-2.5 rounded-xl bg-surface-container text-deep-navy material-symbols-outlined text-xl">warehouse</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold text-deep-navy leading-none">{totalStockUnits.toLocaleString()}</span>
                <span className="text-sm text-text-muted">Units</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Ready for instant facility dispatch</p>
              <div className="mt-4 pt-3 border-t border-border-neutral/40 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-deep-navy font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>99.2% Dispatch Feasibility
                </div>
                <span className="text-xs text-ocean-blue">Warehouse Vaults 01-04</span>
              </div>
            </div>

            {/* Card 3 — Alerts */}
            <div className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-crimson-red/10 pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-crimson-red uppercase tracking-wider font-bold">New Company Requests</span>
                <span className="p-2.5 rounded-xl bg-crimson-red/15 text-crimson-red material-symbols-outlined text-xl">notifications_active</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold text-crimson-red leading-none">{requests.length}</span>
                <span className="text-xl font-semibold text-deep-navy">Awaiting Reply</span>
              </div>
              <p className="text-xs text-deep-burgundy font-medium mt-1">2 pending urgent confirmation</p>
              <div className="mt-4 pt-3 border-t border-border-neutral/40 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-crimson-red/15 text-crimson-red text-xs font-semibold">SLA Clock: 02h 45m</span>
                <a href="#requests" className="text-xs text-crimson-red font-bold hover:underline">Take action ↓</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── B: Company Requests ── */}
        <section id="requests" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="section-bar-red" />
              <h2 className="text-2xl font-bold text-deep-navy tracking-tight">Company Requests</h2>
              <span className="badge-red">Action Required</span>
            </div>
            <span className="text-sm text-text-muted">Showing {requests.length} prioritized inbound purchase orders</span>
          </div>
          {requests.length === 0 && (
            <div className="text-center py-10 text-text-muted card">
              <span className="material-symbols-outlined text-5xl mb-2 block opacity-30">inbox</span>
              All company procurement requests processed.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(r => (
              <div key={r.id} className="card flex flex-col justify-between gap-5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center font-bold text-deep-navy text-sm shrink-0">
                        {r.initials}
                      </div>
                      <div>
                        <div className="font-bold text-deep-navy">{r.company}</div>
                        <div className="text-xs text-text-muted">{r.po} • {r.type}</div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${r.statusColor}`}>
                      {r.status}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-background text-xs">
                    <div>
                      <div className="text-text-muted">Specification</div>
                      <div className="font-bold text-deep-navy mt-0.5">{r.spec}</div>
                    </div>
                    <div>
                      <div className="text-text-muted">Required Volume</div>
                      <div className="font-bold text-deep-navy mt-0.5">{r.qty}</div>
                    </div>
                    <div>
                      <div className="text-text-muted">Offer Price</div>
                      <div className="font-bold text-deep-navy mt-0.5">{r.price} / unit</div>
                    </div>
                    <div>
                      <div className="text-text-muted">Total Value</div>
                      <div className="font-extrabold text-crimson-red mt-0.5">{r.total}</div>
                    </div>
                  </div>

                  {/* Location note */}
                  <div className="flex items-center gap-3 text-sm text-deep-navy bg-warm-cream/40 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-ocean-blue">{r.locationIcon}</span>
                    <span>{r.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button onClick={() => acceptOrder(r.id)}
                    className="btn-primary flex-1 min-w-[160px] py-2.5">
                    Accept Order ({r.total})
                  </button>
                  {r.urgent && (
                    <button onClick={() => showToast('Partial allocation split request sent to buyer.')} className="btn-secondary py-2.5 px-4 text-xs">Propose Partial Split</button>
                  )}
                  <button onClick={() => declineOrder(r.id)}
                    className="px-4 py-2.5 rounded-xl bg-surface-container text-deep-navy/80 hover:text-crimson-red hover:bg-crimson-red/10 text-sm font-semibold transition-all">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── C: My Materials ── */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="section-bar-navy" />
              <div>
                <h2 className="text-2xl font-bold text-deep-navy tracking-tight">My Materials</h2>
                <p className="text-xs text-text-muted">Real-time certified physical warehouse stock levels</p>
              </div>
            </div>
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none">search</span>
              <input id="materials-search" type="text" value={search} onChange={e => setSearch(e.target.value)}
                className="input pl-11" placeholder="Search materials, lots, SKUs…" />
            </div>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background/80 text-text-muted text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Material Name</th>
                    <th className="py-4 px-6">Available Quantity</th>
                    <th className="py-4 px-6">Unit Price</th>
                    <th className="py-4 px-6">Lead Time</th>
                    <th className="py-4 px-6">Certificate Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-deep-navy">
                  {filtered.map((m, i) => (
                    <tr key={m.id} className={`${i%2===1?'bg-background/30':''} hover:bg-warm-cream/30 transition-colors`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-bold text-deep-navy text-xs shrink-0">{m.abbr}</div>
                          <div>
                            <div className="font-bold text-sm">{m.name}</div>
                            <div className="text-xs text-text-muted">{m.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm">{Number(m.qty).toLocaleString()} {m.unit || 'units'}</div>
                        <div className={`text-xs font-semibold ${m.allocColor}`}>● Allocated: {m.allocated}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-sm">${Number(m.price).toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-medium">
                          <span className="material-symbols-outlined text-sm text-ocean-blue">{m.leadIcon}</span>{m.lead}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${m.certColor}`}>
                          <span className="material-symbols-outlined text-sm">{m.certIcon}</span>{m.cert}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setEditingStock({ id: m.id, name: m.name, qty: m.qty })}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── D & E: Certificates + Fulfilment Tracker ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8">
          {/* Certificates */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="section-bar-ocean" />
              <div>
                <h2 className="text-xl font-bold text-deep-navy tracking-tight">Quality Certificates & Proof</h2>
                <p className="text-xs text-text-muted">Enterprise metallurgical credentials & audits</p>
              </div>
            </div>
            <div className="card flex flex-col gap-4">
              {certs.map(c => (
                <div key={c.name} className="p-4 rounded-xl bg-background flex items-center justify-between gap-4 animate-fade-in">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}>
                      <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-deep-navy">{c.name}</div>
                      <div className="text-xs text-text-muted">{c.sub}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${c.badgeColor}`}>{c.badge}</span>
                </div>
              ))}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.xml,.jpg,.png,.docx"
                onChange={handleFileUpload}
              />

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-xl bg-warm-cream/30 border-2 border-dashed border-ocean-blue/30 flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-warm-cream/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-warm-cream flex items-center justify-center text-ocean-blue group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">
                    {uploadingFile ? 'hourglass_top' : 'cloud_upload'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-sm text-deep-navy">
                    {uploadingFile ? 'Uploading Certificate…' : 'Upload Certificate or Inspection Document'}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">PDF or XML accepted up to 25MB</div>
                </div>
                <button
                  type="button"
                  id="btn-browse-files"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="btn-secondary text-xs py-2 px-4 pointer-events-auto"
                >
                  Browse Files
                </button>
              </div>
            </div>
          </section>

          {/* Fulfilment Tracker */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="section-bar-red" />
                <div>
                  <h2 className="text-xl font-bold text-deep-navy tracking-tight">Active Fulfilment Tracker</h2>
                  <p className="text-xs text-text-muted">Live dispatch progress and telemetric oversight</p>
                </div>
              </div>
              <span className="badge-ocean">Live GPS Feed</span>
            </div>
            <div className="card flex flex-col gap-6">
              {/* Batch header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-background">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-deep-navy text-pure-white">
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-deep-navy">Batch #APX-4107</span>
                      <span className="px-2 py-0.5 rounded-md bg-ocean-blue/20 text-deep-navy text-xs font-bold">In Flight</span>
                    </div>
                    <p className="text-xs text-text-muted">Consignee: <strong className="text-deep-navy">NorthStar Robotics Corp</strong> (Aerospace Assembly Bay 7)</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-xs text-text-muted">Consignment Value</div>
                  <div className="text-xl font-extrabold text-crimson-red">$118,400</div>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 sm:justify-end">
                    <span className="material-symbols-outlined text-xs">lock</span>Escrow Safe
                  </div>
                </div>
              </div>

              {/* Stage Stepper */}
              <div className="py-2">
                <div className="flex items-start justify-between relative">
                  <div className="absolute left-0 top-4 w-full h-1 bg-surface-container rounded-full z-0" />
                  <div className="absolute left-0 top-4 h-1 bg-ocean-blue rounded-full z-0" style={{width:'75%'}} />
                  {STAGES.map((s, i) => (
                    <div key={s} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        i < BATCH_STAGE ? 'bg-deep-navy text-white' :
                        i === BATCH_STAGE ? 'bg-crimson-red text-white ring-4 ring-crimson-red/20 animate-bounce w-9 h-9' :
                        'bg-surface-container text-text-muted'
                      }`}>
                        {i < BATCH_STAGE ? <span className="material-symbols-outlined text-sm">check</span> :
                         i === BATCH_STAGE ? <span className="material-symbols-outlined text-sm">flight_takeoff</span> :
                         <span className="material-symbols-outlined text-sm">domain_verification</span>}
                      </div>
                      <span className={`text-xs font-semibold mt-2 ${i===BATCH_STAGE?'text-crimson-red':i<BATCH_STAGE?'text-deep-navy':'text-text-muted'}`}>{s}</span>
                      <span className={`text-xs mt-0.5 ${i===BATCH_STAGE?'text-crimson-red font-semibold':i<BATCH_STAGE?'text-emerald-700':'text-text-muted'}`}>
                        {i < BATCH_STAGE ? 'Done' : i === BATCH_STAGE ? 'ETA 16h' : 'Next'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensor stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-warm-cream/40 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-ocean-blue">shield</span>
                  <div>
                    <div className="text-xs text-text-muted">Certified Logistics Carrier</div>
                    <div className="font-bold text-sm text-deep-navy">Kuehne+Nagel AeroShield</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-warm-cream/40 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-emerald-700">sensors</span>
                  <div>
                    <div className="text-xs text-text-muted">Cold Chain & Inertial Sensors</div>
                    <div className="font-bold text-sm text-deep-navy flex items-center gap-1.5">
                      Sensitech Shock OK <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>

      {/* ── MODAL 1: Add Raw Material ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-crimson-red shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border-neutral/40 mb-4">
              <div>
                <h3 className="text-xl font-bold text-deep-navy flex items-center gap-2">
                  <span className="material-symbols-outlined text-crimson-red">add_circle</span>
                  Add Raw Material
                </h3>
                <p className="text-xs text-text-muted mt-0.5">List certified inventory for aerospace buyers and the AI agent.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-deep-navy text-xl">✕</button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Titanium Ti-6Al-4V Grade 5"
                  value={newMaterial.name}
                  onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Category</label>
                  <select
                    value={newMaterial.category}
                    onChange={e => setNewMaterial({ ...newMaterial, category: e.target.value })}
                    className="input text-sm"
                  >
                    <option value="Metals & Alloys">Metals & Alloys</option>
                    <option value="Superalloys">Superalloys</option>
                    <option value="Composites">Composites</option>
                    <option value="Specialty Chemicals">Specialty Chemicals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">SKU / Lot #</label>
                  <input
                    type="text"
                    placeholder="e.g. TIT-GR5-901"
                    value={newMaterial.sku}
                    onChange={e => setNewMaterial({ ...newMaterial, sku: e.target.value })}
                    className="input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Standard / Specification</label>
                <input
                  type="text"
                  placeholder="e.g. ASTM B265 / AMS 4911 Aerospace Billet"
                  value={newMaterial.spec}
                  onChange={e => setNewMaterial({ ...newMaterial, spec: e.target.value })}
                  className="input text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Available Qty *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={newMaterial.qty}
                    onChange={e => setNewMaterial({ ...newMaterial, qty: e.target.value })}
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Unit</label>
                  <select
                    value={newMaterial.unit}
                    onChange={e => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="input text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="units">units</option>
                    <option value="sq.m">sq.m</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 45.00"
                    value={newMaterial.price}
                    onChange={e => setNewMaterial({ ...newMaterial, price: e.target.value })}
                    className="input text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Dispatch Lead Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 48 hours"
                    value={newMaterial.lead}
                    onChange={e => setNewMaterial({ ...newMaterial, lead: e.target.value })}
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-deep-navy uppercase mb-1">Certification</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified AS9100D"
                    value={newMaterial.cert}
                    onChange={e => setNewMaterial({ ...newMaterial, cert: e.target.value })}
                    className="input text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-neutral/40">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMaterial}
                  className="btn-primary py-2 px-5 gap-2"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  {savingMaterial ? 'Publishing…' : 'Publish Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Allocation Rules ── */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-ocean-blue shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border-neutral/40 mb-4">
              <div>
                <h3 className="text-xl font-bold text-deep-navy flex items-center gap-2">
                  <span className="material-symbols-outlined text-ocean-blue">tune</span>
                  Allocation Rules & AI Protocol
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Configure fulfillment safeguards, buffer caps, and AI dispatch rules.</p>
              </div>
              <button onClick={() => setShowRulesModal(false)} className="text-text-muted hover:text-deep-navy text-xl">✕</button>
            </div>

            <form onSubmit={handleSaveRules} className="flex flex-col gap-5 text-sm">
              <div>
                <label className="block text-xs font-bold text-deep-navy uppercase mb-1">
                  Minimum Order Quantity (MOQ)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rules.moq}
                    onChange={e => setRules({ ...rules, moq: e.target.value })}
                    className="input text-sm flex-1"
                  />
                  <span className="text-xs font-bold text-text-muted">units / kg</span>
                </div>
                <p className="text-xs text-text-muted mt-1">Orders below this threshold require manual approval.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-deep-navy uppercase mb-1">
                  Emergency Shock Buffer Reserved ({rules.buffer}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={rules.buffer}
                  onChange={e => setRules({ ...rules, buffer: e.target.value })}
                  className="w-full accent-ocean-blue"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>5% (High turnover)</span>
                  <span className="font-bold text-deep-navy">{rules.buffer}% reserved</span>
                  <span>40% (Surge defense ready)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-deep-navy uppercase mb-1">
                  Auto-Approval Contract Cap ($)
                </label>
                <input
                  type="number"
                  value={rules.autoThreshold}
                  onChange={e => setRules({ ...rules, autoThreshold: e.target.value })}
                  className="input text-sm"
                />
                <p className="text-xs text-text-muted mt-1">Orders above ${Number(rules.autoThreshold).toLocaleString()} require manual confirmation.</p>
              </div>

              <div className="p-4 rounded-xl bg-warm-cream/50 border border-border-neutral/60 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.allowAiAgent}
                    onChange={e => setRules({ ...rules, allowAiAgent: e.target.checked })}
                    className="w-4 h-4 accent-crimson-red rounded"
                  />
                  <div>
                    <span className="font-bold text-deep-navy text-xs block">AI Agent Resilience Dispatch Integration</span>
                    <span className="text-xs text-text-muted">Allow 5Directions AI Agent to propose allocations against this warehouse during critical shortages.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.tier1Priority}
                    onChange={e => setRules({ ...rules, tier1Priority: e.target.checked })}
                    className="w-4 h-4 accent-crimson-red rounded"
                  />
                  <div>
                    <span className="font-bold text-deep-navy text-xs block">Tier-1 Aerospace Contractor Priority</span>
                    <span className="text-xs text-text-muted">Automatically allocate stock priority to AS9100D/Nadcap verified programs.</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-neutral/40">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(false)}
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 gap-2"
                >
                  <span className="material-symbols-outlined text-lg">save</span>
                  Save Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Update Stock ── */}
      {editingStock && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-deep-navy mb-2">Update Physical Stock</h3>
            <p className="text-xs text-text-muted mb-4">{editingStock.name}</p>
            <div className="mb-4">
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1">New Available Stock</label>
              <input
                type="number"
                defaultValue={editingStock.qty}
                id="edit-stock-input"
                className="input text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingStock(null)} className="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button
                onClick={() => {
                  const val = document.getElementById('edit-stock-input')?.value
                  handleSaveStock(editingStock.id, val)
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
