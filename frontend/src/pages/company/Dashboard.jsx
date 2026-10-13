import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CompanyHeader } from '../../components/layout/Header'

/* ── Mock data ── */
const ACTIVE_SUPPLIERS = [
  { id:1, name:'Titan Works', country:'Germany', material:'Ti-6Al-4V', stock:24000, allocation:40, status:'Active', cert:'AS9100D' },
  { id:2, name:'Vanguard Metals', country:'USA', material:'Ti-6Al-4V', stock:18500, allocation:40, status:'Active', cert:'ISO 9001' },
  { id:3, name:'Apex Forge', country:'Japan', material:'Ti-6Al-4V', stock:8200, allocation:20, status:'Backup', cert:'JIS Q 9100' },
]

const RECENT_ORDERS = [
  { id:'PO-2024-001', supplier:'Titan Works', material:'Ti-6Al-4V Grade 5', qty:'5,000 units', value:'$210,000', status:'In Transit',   statusColor:'text-ocean-blue bg-ocean-blue/10' },
  { id:'PO-2024-002', supplier:'Vanguard Metals', material:'Aluminum 7075', qty:'3,500 units', value:'$68,250', status:'Processing',  statusColor:'text-amber-700 bg-amber-100' },
  { id:'PO-2024-003', supplier:'Apex Forge', material:'Carbon Fiber 12K', qty:'2,000 kg',   value:'$62,400', status:'Delivered',   statusColor:'text-emerald-700 bg-emerald-100' },
]

const DISRUPTION_ALERTS = [
  { id:1, severity:'high', supplier:'Primary Supplier A', issue:'Port congestion — Rotterdam', eta:'72h delay', action:'Reroute via Vanguard' },
]

export default function CompanyDashboard() {
  const [allocations, setAllocations] = useState({ 1:40, 2:40, 3:20 })

  const totalAlloc = Object.values(allocations).reduce((a,b) => a+b, 0)

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <CompanyHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">

        {/* Welcome */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-blue/15 text-deep-navy text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-ocean-blue animate-pulse"></span>Live Company Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight">Welcome to Your Company Dashboard</h1>
            <p className="text-text-muted mt-1">Manage your suppliers, allocate orders, and track fulfilment in real-time.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/company/find-materials" className="btn-secondary gap-2">
              <span className="material-symbols-outlined text-lg">search</span>Find Materials
            </Link>
            <Link to="/company/compare-suppliers" className="btn-primary gap-2">
              <span className="material-symbols-outlined text-lg">compare_arrows</span>Compare Suppliers
            </Link>
          </div>
        </section>

        {/* ── Disruption Alert ── */}
        {DISRUPTION_ALERTS.map(a => (
          <div key={a.id} className="flex items-start gap-4 p-4 rounded-2xl bg-crimson-red/8 border border-crimson-red/20 animate-fade-in">
            <div className="p-2 rounded-xl bg-crimson-red/15">
              <span className="material-symbols-outlined text-crimson-red text-xl">warning</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-deep-navy text-sm">Supply Disruption Detected</span>
                <span className="badge-red">High Priority</span>
              </div>
              <p className="text-sm text-text-muted">{a.supplier} — {a.issue} • ETA Impact: {a.eta}</p>
            </div>
            <button className="btn-primary text-xs py-2 px-3 gap-1">
              <span className="material-symbols-outlined text-sm">bolt</span>{a.action}
            </button>
          </div>
        ))}

        {/* ── KPI Cards ── */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label:'Active Suppliers',  value:'12',    sub:'3 backup suppliers ready',  icon:'factory',        color:'bg-warm-cream text-deep-navy' },
              { label:'In-Transit Orders', value:'34',    sub:'$2.1M total value',         icon:'local_shipping', color:'bg-ocean-blue/10 text-ocean-blue' },
              { label:'Certs Verified',    value:'98%',   sub:'2 renewals due in 30 days', icon:'verified',       color:'bg-emerald-50 text-emerald-600' },
              { label:'SLA Performance',   value:'99.98%',sub:'Last 90 days on-time',     icon:'speed',          color:'bg-crimson-red/10 text-crimson-red' },
            ].map(k => (
              <div key={k.label} className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-warm-cream/50 pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">{k.label}</span>
                  <span className={`p-2.5 rounded-xl material-symbols-outlined text-xl ${k.color}`}>{k.icon}</span>
                </div>
                <div className="text-4xl font-extrabold text-deep-navy mb-1">{k.value}</div>
                <p className="text-xs text-text-muted">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Multi-Supplier Allocation ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="section-bar-red" />
            <div>
              <h2 className="text-2xl font-bold text-deep-navy tracking-tight">Multi-Supplier Allocation</h2>
              <p className="text-sm text-text-muted">Distribute your procurement across primary and backup suppliers</p>
            </div>
          </div>
          <div className="card">
            {/* Stacked bar */}
            <div className="flex rounded-full overflow-hidden h-4 mb-4 gap-0.5">
              {ACTIVE_SUPPLIERS.map((s,i) => (
                <div key={s.id} title={s.name}
                  className={`h-full transition-all duration-500 ${i===0?'bg-deep-navy':i===1?'bg-ocean-blue':'bg-crimson-red'}`}
                  style={{width:`${allocations[s.id]}%`}} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-6 text-xs text-text-muted">
              {ACTIVE_SUPPLIERS.map((s,i) => (
                <span key={s.id} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${i===0?'bg-deep-navy':i===1?'bg-ocean-blue':'bg-crimson-red'}`}></span>
                  {s.name} — {allocations[s.id]}%
                </span>
              ))}
              {totalAlloc !== 100 && <span className="text-crimson-red font-semibold">(Total: {totalAlloc}% — must equal 100%)</span>}
            </div>
            {/* Supplier rows */}
            <div className="flex flex-col gap-3">
              {ACTIVE_SUPPLIERS.map((s) => (
                <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-background hover:bg-warm-cream/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-bold text-deep-navy text-sm shrink-0">
                      {s.name.split(' ').map(w=>w[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-deep-navy text-sm truncate">{s.name}
                        <span className={`ml-2 badge-${s.status==='Active'?'ocean':'amber'}`}>{s.status}</span>
                      </div>
                      <div className="text-xs text-text-muted">{s.country} • {s.material} • {s.cert}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-text-muted">Stock: <strong className="text-deep-navy">{s.stock.toLocaleString()}</strong></span>
                    <input type="range" min="0" max="100" value={allocations[s.id]}
                      onChange={e => setAllocations(a => ({...a,[s.id]:+e.target.value}))}
                      className="w-28 accent-crimson-red" />
                    <span className="text-sm font-bold text-deep-navy w-10 text-right">{allocations[s.id]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent Orders ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="section-bar-navy" />
              <h2 className="text-2xl font-bold text-deep-navy tracking-tight">Recent Orders</h2>
            </div>
            <Link to="/company/orders" className="text-sm text-ocean-blue font-semibold hover:text-deep-navy transition-colors">
              View all →
            </Link>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background/80 text-text-muted text-xs uppercase tracking-wider">
                    <th className="py-3 px-6">Order ID</th>
                    <th className="py-3 px-6">Supplier</th>
                    <th className="py-3 px-6">Material</th>
                    <th className="py-3 px-6">Qty</th>
                    <th className="py-3 px-6">Value</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-neutral/30">
                  {RECENT_ORDERS.map(o => (
                    <tr key={o.id} className="hover:bg-warm-cream/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-deep-navy text-sm">{o.id}</td>
                      <td className="py-4 px-6 text-sm text-text-muted">{o.supplier}</td>
                      <td className="py-4 px-6 text-sm text-deep-navy">{o.material}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-deep-navy">{o.qty}</td>
                      <td className="py-4 px-6 text-sm font-bold text-crimson-red">{o.value}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${o.statusColor}`}>{o.status}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="btn-ghost text-xs py-1.5 px-3">
                          <span className="material-symbols-outlined text-sm">open_in_new</span>Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Quick Links ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8">
          {[
            { to:'/company/find-materials',    icon:'search',         label:'Find Raw Materials', desc:'Search 2,400+ verified suppliers' },
            { to:'/company/compare-suppliers', icon:'compare_arrows', label:'Compare Suppliers',  desc:'Side-by-side comparison' },
            { to:'/company/orders',            icon:'receipt_long',   label:'All Orders',         desc:'Full order history & tracking' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="card hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-warm-cream flex items-center justify-center text-deep-navy group-hover:scale-110 transition-transform shrink-0">
                <span className="material-symbols-outlined text-2xl">{l.icon}</span>
              </div>
              <div>
                <div className="font-bold text-deep-navy text-sm">{l.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{l.desc}</div>
              </div>
            </Link>
          ))}
        </section>

      </main>
    </div>
  )
}
