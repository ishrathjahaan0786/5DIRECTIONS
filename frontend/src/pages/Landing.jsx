import { Link } from 'react-router-dom'
import { PublicHeader } from '../components/layout/Header'

const FEATURES = [
  {
    icon: 'search',
    title: 'Find Raw Materials',
    desc: 'Search verified suppliers across 140+ countries for any material specification. Real-time stock and pricing.',
  },
  {
    icon: 'compare_arrows',
    title: 'Compare Suppliers',
    desc: 'Side-by-side comparison of pricing, lead times, certifications, and reliability scores.',
  },
  {
    icon: 'pie_chart',
    title: 'Multi-Supplier Allocation',
    desc: 'Distribute orders across primary, secondary, and backup suppliers with live feasibility calculations.',
  },
  {
    icon: 'workspace_premium',
    title: 'Certificate Management',
    desc: 'ISO, AS9100D, REACH — track, upload, and verify all quality certificates in one place.',
  },
  {
    icon: 'local_shipping',
    title: 'Order Tracking',
    desc: 'Live fulfilment tracker with GPS feed, carrier telemetry, and cold-chain sensor integration.',
  },
  {
    icon: 'warning',
    title: 'Disruption Alerts',
    desc: 'AI-powered early warning system surfaces alternative suppliers the moment a disruption is detected.',
  },
]

const STATS = [
  { value: '99.98%', label: 'On-Time SLA' },
  { value: '2,400+', label: 'Active Suppliers' },
  { value: '$2.1B',  label: 'Orders Managed' },
  { value: '140+',   label: 'Countries' },
]

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFCF7]">
      <PublicHeader />

      <main className="flex-1 pt-20">
        {/* ── HERO ── */}
        <section className="relative w-full overflow-hidden px-6 lg:px-20 pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson-red/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-ocean-blue/8 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero copy */}
            <div className="flex flex-col gap-6 animate-slide-up">
              <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-blue/15 text-deep-navy font-semibold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm text-ocean-blue">new_releases</span>
                Resilience Operating System 3.0
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-deep-navy leading-tight tracking-tight">
                One disruption.<br />
                <span className="text-crimson-red">Smarter alternatives.</span><br />
                A resilient supply chain.
              </h1>
              <p className="text-lg text-deep-navy/70 leading-relaxed max-w-xl">
                5Directions gives your procurement team verified multi-supplier allocation, live order tracking, and instant disruption recovery — all in one enterprise workspace.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Link to="/sign-up" id="hero-cta" className="btn-primary text-base px-8 py-4 gap-2">
                  <span className="material-symbols-outlined text-xl">rocket_launch</span>Get Started Free
                </Link>
                <a href="#features" className="btn-secondary text-base px-8 py-4 gap-2">
                  <span className="material-symbols-outlined text-xl">play_circle</span>See Features
                </a>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-2">
                {['ISO 27001 Certified','SOC 2 Type II','GDPR Compliant'].map(b => (
                  <span key={b} className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                    <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>{b}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero visual card */}
            <div className="relative">
              <div className="card p-0 overflow-hidden shadow-card-lg">
                {/* Header bar */}
                <div className="bg-deep-navy px-5 py-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-crimson-red"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="ml-3 text-white/40 text-xs font-mono">5directions.app/company/dashboard</span>
                </div>
                <div className="p-6 bg-[#FFFCF7]">
                  {/* Mini KPI cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label:'Active Suppliers', value:'12', icon:'factory', color:'text-ocean-blue bg-ocean-blue/10' },
                      { label:'In-Transit Orders', value:'34', icon:'local_shipping', color:'text-crimson-red bg-crimson-red/10' },
                      { label:'Certs Valid',        value:'98%',icon:'verified',color:'text-emerald-600 bg-emerald-50' },
                    ].map(k => (
                      <div key={k.label} className="bg-pure-white rounded-xl p-3 shadow-card">
                        <div className={`w-8 h-8 rounded-lg ${k.color} flex items-center justify-center mb-2`}>
                          <span className="material-symbols-outlined text-lg">{k.icon}</span>
                        </div>
                        <div className="text-xl font-extrabold text-deep-navy">{k.value}</div>
                        <div className="text-xs text-text-muted">{k.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Allocation bar */}
                  <div className="bg-pure-white rounded-xl p-4 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-deep-navy">Multi-Supplier Allocation</span>
                      <span className="badge-green">Optimised</span>
                    </div>
                    <div className="flex rounded-full overflow-hidden h-3 mb-2">
                      <div className="bg-deep-navy h-full" style={{width:'40%'}}></div>
                      <div className="bg-ocean-blue h-full" style={{width:'40%'}}></div>
                      <div className="bg-crimson-red h-full" style={{width:'20%'}}></div>
                    </div>
                    <div className="flex gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-deep-navy inline-block"></span>Titan Works 40%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ocean-blue inline-block"></span>Vanguard 40%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-crimson-red inline-block"></span>Apex 20%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-deep-navy text-white px-4 py-3 rounded-2xl shadow-card-lg text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Zero factory halts logged
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-deep-navy py-12 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-20 px-6 lg:px-20 bg-pure-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-blue/15 text-deep-navy font-semibold text-xs uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-sm text-ocean-blue">auto_awesome</span>Platform Features
              </span>
              <h2 className="text-4xl font-extrabold text-deep-navy mb-3">Engineered for Extreme Continuity</h2>
              <p className="text-text-muted text-base max-w-xl mx-auto">Every tool your procurement team needs to source smarter, allocate intelligently, and recover instantly.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(f => (
                <div key={f.title} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-warm-cream flex items-center justify-center text-deep-navy mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg text-deep-navy mb-2">{f.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-ocean-blue text-sm font-semibold group-hover:text-deep-navy transition-colors">
                    Learn more <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="about" className="py-20 px-6 lg:px-20 bg-[#FFFCF7]">
          <div className="max-w-3xl mx-auto text-center">
            <img src="/logo.jpg" alt="5Directions" className="w-16 h-16 rounded-2xl object-contain mx-auto mb-6 shadow-card" />
            <h2 className="text-4xl font-extrabold text-deep-navy mb-4">Ready to build a resilient supply chain?</h2>
            <p className="text-text-muted text-base mb-8 leading-relaxed">
              Join leading manufacturers and procurement teams who trust 5Directions to keep their production lines running — no matter what.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/sign-up" id="footer-cta" className="btn-primary text-base px-8 py-4">
                <span className="material-symbols-outlined text-xl">rocket_launch</span>Start Free Trial
              </Link>
              <Link to="/sign-in" className="btn-secondary text-base px-8 py-4">Sign In</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-deep-navy py-8 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="5Directions" className="w-8 h-8 rounded-lg object-contain ring-1 ring-white/20" />
            <span className="text-white/60 text-sm">© 2026 5Directions. All rights reserved.</span>
          </div>
          <div className="flex gap-4 text-white/40 text-sm">
            <a href="#" className="hover:text-white/80 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/80 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/80 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
