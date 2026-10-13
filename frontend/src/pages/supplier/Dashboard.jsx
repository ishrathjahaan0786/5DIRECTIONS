import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SupplierHeader } from '../../components/layout/Header'

const COMPANY_REQUESTS = [
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

const MY_MATERIALS = [
  { id:1, abbr:'Ti', name:'Titanium Ti-6Al-4V Grade 5', sku:'TIT-GR5-408 • Hot-Rolled Billet', qty:'8,500 units', allocated:'0 units', allocColor:'text-emerald-700', price:'$42.00', lead:'48 hours', leadIcon:'bolt', cert:'Verified AS9100D', certColor:'text-emerald-700 bg-emerald-100', certIcon:'verified_user' },
  { id:2, abbr:'Ni', name:'Nickel Alloy 625 (Inconel)',  sku:'NIC-625-780 • Vacuum Arc Remelt',  qty:'4,200 units', allocated:'800 units', allocColor:'text-ocean-blue', price:'$68.50', lead:'72 hours', leadIcon:'schedule', cert:'Verified ISO 9001', certColor:'text-emerald-700 bg-emerald-100', certIcon:'verified_user' },
  { id:3, abbr:'CF', name:'Carbon Fiber Tow 12K',         sku:'CFT-12K-002 • Continuous Filament', qty:'12,000 kg',  allocated:'2,500 kg', allocColor:'text-text-muted', price:'$31.20', lead:'5 Days', leadIcon:'calendar_today', cert:'Pending REACH', certColor:'text-amber-700 bg-amber-100', certIcon:'hourglass_top' },
]

const CERTS = [
  { name:'ISO 9001:2015', sub:'Verified Quality Management Suite', badge:'Valid 2026', badgeColor:'text-emerald-700 bg-emerald-100', icon:'verified', iconBg:'bg-emerald-100 text-emerald-800' },
  { name:'AS9100D Aerospace', sub:'Verified Defense & Aero Standard', badge:'Audit Passed', badgeColor:'text-emerald-700 bg-emerald-100', icon:'workspace_premium', iconBg:'bg-emerald-100 text-emerald-800' },
]

const STAGES = ['Pending','Accepted','Preparing','Dispatched','Delivered']
const BATCH_STAGE = 3 // Dispatched

export default function SupplierDashboard() {
  const [search, setSearch] = useState('')
  const [requests, setRequests] = useState(COMPANY_REQUESTS)

  const acceptOrder = (id) => setRequests(r => r.filter(x => x.id !== id))
  const declineOrder = (id) => setRequests(r => r.filter(x => x.id !== id))

  const filtered = MY_MATERIALS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <SupplierHeader />
      <main className="pt-20 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">

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
            <div className="flex items-center gap-3 shrink-0">
              <button className="btn-secondary gap-2">
                <span className="material-symbols-outlined text-lg">tune</span>Allocation Rules
              </button>
              <button id="btn-add-material" className="btn-primary gap-2">
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
                <span className="text-5xl font-extrabold text-deep-navy leading-none">3</span>
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
                <span className="text-5xl font-extrabold text-deep-navy leading-none">148,500</span>
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
            <div className="text-center py-10 text-text-muted">
              <span className="material-symbols-outlined text-5xl mb-2 block opacity-30">inbox</span>
              All requests have been handled.
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map(r => (
              <div key={r.id} className="card flex flex-col gap-6 hover:shadow-card-lg transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center font-bold text-deep-navy text-sm">
                        {r.initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-deep-navy text-base">{r.company}</h3>
                        <p className="text-xs text-text-muted">{r.po} • {r.type}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shrink-0 ${r.statusColor}`}>
                      <span className="material-symbols-outlined text-xs">{r.urgent ? 'check_circle' : 'pending'}</span>
                      {r.status}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-background">
                    <div><span className="text-xs text-text-muted block">Specification</span><span className="text-xs font-bold text-deep-navy">{r.spec}</span></div>
                    <div><span className="text-xs text-text-muted block">Required Volume</span><span className="text-xs font-bold text-deep-navy">{r.qty}</span></div>
                    <div><span className="text-xs text-text-muted block">Offer Price</span><span className="text-xs font-bold text-deep-navy">{r.price} / unit</span></div>
                    <div><span className="text-xs text-text-muted block">Total Value</span><span className="text-xs font-extrabold text-crimson-red">{r.total}</span></div>
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
                    <button className="btn-secondary py-2.5 px-4 text-xs">Propose Partial Split</button>
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
                        <div className="font-bold text-sm">{m.qty}</div>
                        <div className={`text-xs font-semibold ${m.allocColor}`}>● Allocated: {m.allocated}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-sm">{m.price}</td>
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
                        <button className="btn-secondary text-xs py-2 px-3">Update Stock</button>
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
              {CERTS.map(c => (
                <div key={c.name} className="p-4 rounded-xl bg-background flex items-center justify-between gap-4">
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
              {/* Upload zone */}
              <div className="p-6 rounded-xl bg-warm-cream/30 flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-warm-cream/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-warm-cream flex items-center justify-center text-ocean-blue group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-deep-navy">Upload Certificate or Inspection Document</div>
                  <div className="text-xs text-text-muted mt-0.5">PDF or XML accepted up to 25MB</div>
                </div>
                <button className="btn-secondary text-xs py-2 px-4">Browse Files</button>
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

              {/* Carrier & Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-warm-cream/40 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-ocean-blue">shield_with_house</span>
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
    </div>
  )
}
