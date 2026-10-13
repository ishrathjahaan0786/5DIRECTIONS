import { useState } from 'react'
import { SupplierHeader } from '../../components/layout/Header'

const ORDERS = [
  { id:'SO-2024-001', buyer:'NorthStar Robotics Corp', material:'Ti-6Al-4V Grade 5', qty:'2,000 units', value:'$84,000', stage:3, date:'2026-10-12', carrier:'Kuehne+Nagel AeroShield', batch:'APX-4107' },
  { id:'SO-2024-002', buyer:'AeroDynamic Systems Ltd', material:'Aluminum 7075-T6',  qty:'3,500 units', value:'$68,250', stage:1, date:'2026-10-13', carrier:'DHL Supply Chain',       batch:'APX-4108' },
  { id:'SO-2024-003', buyer:'Vance Aerospace',         material:'Carbon Fiber 12K',  qty:'800 kg',      value:'$24,960', stage:4, date:'2026-10-10', carrier:'FedEx Custom Critical',   batch:'APX-4099' },
]

const STAGES = ['Pending','Accepted','Preparing','Dispatched','Delivered']

export default function MyOrders() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <SupplierHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        <section>
          <h1 className="text-4xl font-extrabold text-deep-navy tracking-tight mb-1">My Orders</h1>
          <p className="text-text-muted">All accepted sales orders and their fulfilment status.</p>
        </section>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total Orders', value:ORDERS.length, icon:'receipt_long', color:'bg-warm-cream' },
            { label:'In Transit',   value:ORDERS.filter(o=>o.stage===3).length, icon:'local_shipping', color:'bg-ocean-blue/10' },
            { label:'Delivered',    value:ORDERS.filter(o=>o.stage===4).length, icon:'check_circle',   color:'bg-emerald-50' },
          ].map(k => (
            <div key={k.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${k.color}`}>
                <span className="material-symbols-outlined text-deep-navy text-2xl">{k.icon}</span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-deep-navy">{k.value}</div>
                <div className="text-xs text-text-muted">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {ORDERS.map(o => (
            <div key={o.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(e => e===o.id ? null : o.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-deep-navy text-xl">local_shipping</span>
                  </div>
                  <div>
                    <div className="font-bold text-deep-navy">{o.id} — {o.batch}</div>
                    <div className="text-xs text-text-muted">{o.buyer} · {o.date}</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm text-text-muted">{o.material}</span>
                  <span className="font-semibold text-sm text-deep-navy">{o.qty}</span>
                  <span className="font-bold text-crimson-red text-sm">{o.value}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    o.stage===4?'text-emerald-700 bg-emerald-100':o.stage===3?'text-ocean-blue bg-ocean-blue/10':'text-amber-700 bg-amber-100'
                  }`}>{STAGES[o.stage]}</span>
                  <span className={`material-symbols-outlined text-text-muted text-xl transition-transform ${expanded===o.id?'rotate-180':''}`}>expand_more</span>
                </div>
              </div>
              {expanded === o.id && (
                <div className="mt-6 pt-6 border-t border-border-neutral animate-fade-in">
                  {/* Stepper */}
                  <div className="flex items-start justify-between relative mb-6">
                    <div className="absolute left-0 top-4 w-full h-1 bg-surface-container rounded-full z-0" />
                    <div className="absolute left-0 top-4 h-1 bg-ocean-blue rounded-full z-0 transition-all" style={{width:`${(o.stage/4)*100}%`}} />
                    {STAGES.map((s, i) => (
                      <div key={s} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                          i < o.stage ? 'bg-deep-navy text-white' :
                          i === o.stage ? `${o.stage===4?'bg-emerald-600':'bg-crimson-red'} text-white ring-4 ring-current/20` :
                          'bg-surface-container text-text-muted'
                        }`}>
                          {i <= o.stage ? <span className="material-symbols-outlined text-sm">check</span> :
                            <span className="text-xs">{i+1}</span>}
                        </div>
                        <span className={`text-xs font-semibold mt-2 ${i<=o.stage?'text-deep-navy':'text-text-muted'}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-warm-cream/40 flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-ocean-blue">local_shipping</span>
                    <span>Carrier: <strong>{o.carrier}</strong></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
