import { useState } from 'react'
import { SupplierHeader } from '../../components/layout/Header'

const REQUESTS = [
  { id:1, company:'NorthStar Robotics Corp', initials:'NR', po:'PO #NSR-2024-8891', spec:'Ti-6Al-4V Titanium', qty:'2,000 units', price:'$42.00', total:'$84,000', deadline:'Oct 15', status:'urgent', statusLabel:'Urgent', sla:'02h 45m' },
  { id:2, company:'AeroDynamic Systems Ltd', initials:'AD', po:'PO #ADS-9932',       spec:'Aluminum 7075-T6',  qty:'3,500 units', price:'$19.50', total:'$68,250', deadline:'Oct 18', status:'pending', statusLabel:'Pending', sla:'5 days' },
  { id:3, company:'Vance Aerospace',          initials:'VA', po:'PO #VA-4821',        spec:'Carbon Fiber 12K',  qty:'800 kg',      price:'$31.20', total:'$24,960', deadline:'Oct 20', status:'new', statusLabel:'New', sla:'7 days' },
]

export default function CompanyRequests() {
  const [requests, setRequests] = useState(REQUESTS)
  const [filter, setFilter] = useState('All')

  const filters = ['All','Urgent','Pending','New']
  const shown = filter === 'All' ? requests : requests.filter(r => r.statusLabel === filter)

  const handle = (id, action) => {
    setRequests(r => r.filter(x => x.id !== id))
  }

  const statusStyle = { urgent:'text-crimson-red bg-crimson-red/10', pending:'text-amber-700 bg-amber-100', new:'text-ocean-blue bg-ocean-blue/10' }

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <SupplierHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight mb-1">Company Requests</h1>
            <p className="text-text-muted">Inbound purchase orders from your buyer network.</p>
          </div>
          <div className="badge-red self-start text-sm px-3 py-1.5">{requests.length} pending actions</div>
        </section>

        {/* Filter */}
        <div className="flex gap-1 p-1 bg-surface-container w-fit rounded-xl">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter===f?'bg-pure-white text-deep-navy shadow-card':'text-text-muted hover:text-deep-navy'}`}>{f}</button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {shown.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">inbox</span>No requests.
            </div>
          )}
          {shown.map(r => (
            <div key={r.id} className="card flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center font-bold text-deep-navy">{r.initials}</div>
                  <div>
                    <div className="font-bold text-deep-navy">{r.company}</div>
                    <div className="text-xs text-text-muted">{r.po}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>{r.statusLabel}</span>
                  <span className="text-xs text-text-muted">SLA: {r.sla}</span>
                  <span className="text-xs text-text-muted">Due: {r.deadline}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-background text-sm">
                <div><span className="text-xs text-text-muted block">Specification</span><span className="font-bold text-deep-navy">{r.spec}</span></div>
                <div><span className="text-xs text-text-muted block">Volume</span><span className="font-bold text-deep-navy">{r.qty}</span></div>
                <div><span className="text-xs text-text-muted block">Offer Price</span><span className="font-bold text-deep-navy">{r.price} / unit</span></div>
                <div><span className="text-xs text-text-muted block">Total Value</span><span className="font-extrabold text-crimson-red">{r.total}</span></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handle(r.id,'accept')} className="btn-primary flex-1 min-w-[140px] py-2.5">Accept Order ({r.total})</button>
                <button className="btn-secondary py-2.5 px-4 text-xs">Propose Counter</button>
                <button onClick={() => handle(r.id,'decline')} className="px-4 py-2.5 rounded-xl bg-surface-container text-deep-navy/80 hover:text-crimson-red hover:bg-crimson-red/10 text-sm font-semibold transition-all">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
