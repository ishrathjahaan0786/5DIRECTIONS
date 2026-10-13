import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/* ── Public navigation (Landing page) ── */
export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/95 backdrop-blur-md border-b border-deep-navy/10 shadow-card">
      <div className="h-20 w-full px-6 lg:px-10 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.jpg" alt="5Directions Logo" className="w-9 h-9 rounded-xl object-contain shadow-sm ring-1 ring-deep-navy/10" />
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-deep-navy leading-tight">5Directions</span>
            <span className="text-xs text-ocean-blue font-semibold uppercase tracking-wider -mt-0.5">Resilient Supply Chain</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Home</NavLink>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <Link to="/sign-in" className="nav-link hidden sm:inline-flex">Sign In</Link>
          <Link to="/sign-up" className="btn-primary">Get Started</Link>
          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-xl hover:bg-warm-cream transition-colors" onClick={() => setMobileOpen(v => !v)}>
            <span className="material-symbols-outlined text-deep-navy text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-pure-white border-t border-deep-navy/5 px-6 py-4 flex flex-col gap-2 animate-fade-in">
          <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#about" className="nav-link" onClick={() => setMobileOpen(false)}>About</a>
          <Link to="/sign-in" className="nav-link" onClick={() => setMobileOpen(false)}>Sign In</Link>
          <Link to="/sign-up" className="btn-primary mt-1" onClick={() => setMobileOpen(false)}>Get Started</Link>
        </div>
      )}
    </header>
  )
}

/* ── Company Dashboard navigation ── */
const COMPANY_LINKS = [
  { path: '/company/dashboard',         label: 'Dashboard' },
  { path: '/company/find-materials',    label: 'Find Raw Materials' },
  { path: '/company/compare-suppliers', label: 'Compare Suppliers' },
  { path: '/company/orders',            label: 'Orders' },
]

export function CompanyHeader() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/sign-in')
  }

  const companyName = user?.user_metadata?.company_name || 'My Company'
  const fullName    = user?.user_metadata?.full_name    || user?.email || 'User'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/95 backdrop-blur-md border-b border-deep-navy/10 shadow-card">
      <div className="h-20 w-full px-6 lg:px-10 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-8 min-w-0">
          <Link to="/company/dashboard" className="flex items-center gap-3 shrink-0">
            <img src="/logo.jpg" alt="5Directions Logo" className="w-9 h-9 rounded-xl object-contain shadow-sm ring-1 ring-deep-navy/10" />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg tracking-tight text-deep-navy leading-tight">5Directions</span>
              <span className="text-xs text-ocean-blue font-semibold uppercase tracking-wider -mt-0.5">Enterprise Console</span>
            </div>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#FFFCF7] rounded-2xl border border-deep-navy/10">
            {COMPANY_LINKS.map(l => (
              <NavLink key={l.path} to={l.path}
                className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: User menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile nav toggle */}
          <button className="xl:hidden p-2 rounded-xl hover:bg-warm-cream transition-colors" onClick={() => setMobileOpen(v => !v)}>
            <span className="material-symbols-outlined text-deep-navy text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
          {/* Profile dropdown */}
          <div className="relative">
            <button
              id="company-profile-btn"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border border-deep-navy/10 bg-pure-white hover:bg-warm-cream/30 transition-all text-left"
              onClick={() => setProfileOpen(v => !v)}
            >
              <div className="w-8 h-8 rounded-full bg-crimson-red text-pure-white flex items-center justify-center font-bold text-sm">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-bold text-xs text-deep-navy leading-tight">{companyName}</span>
                <span className="text-xs text-deep-navy/60 leading-none">{fullName}</span>
              </div>
              <span className={`material-symbols-outlined text-deep-navy/60 text-lg transition-transform ${profileOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-pure-white border border-deep-navy/10 shadow-card-lg p-2 animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-deep-navy/5 mb-1">
                  <p className="text-xs text-ocean-blue uppercase font-bold tracking-wider">Active Session</p>
                  <p className="text-sm text-deep-navy font-semibold truncate">Company Buyer Profile</p>
                </div>
                <button onClick={handleLogout} id="company-logout-btn"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-crimson-red hover:bg-crimson-red/10 transition-colors">
                  <span className="material-symbols-outlined text-base">logout</span>Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="xl:hidden bg-pure-white border-t border-deep-navy/5 px-6 py-4 flex flex-col gap-2 animate-fade-in">
          {COMPANY_LINKS.map(l => (
            <NavLink key={l.path} to={l.path}
              className={({ isActive }) => isActive ? 'nav-link-active block' : 'nav-link block'}
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

/* ── Supplier Dashboard navigation ── */
const SUPPLIER_LINKS = [
  { path: '/supplier/dashboard',         label: 'Dashboard' },
  { path: '/supplier/my-materials',      label: 'My Materials' },
  { path: '/supplier/company-requests',  label: 'Company Requests' },
  { path: '/supplier/my-orders',         label: 'My Orders' },
]

export function SupplierHeader() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/sign-in')
  }

  const companyName = user?.user_metadata?.company_name || 'My Supplier Co.'
  const fullName    = user?.user_metadata?.full_name    || user?.email || 'User'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/95 backdrop-blur-md border-b border-deep-navy/10 shadow-card">
      <div className="h-20 w-full px-6 lg:px-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0">
          <Link to="/supplier/dashboard" className="flex items-center gap-3 shrink-0">
            <img src="/logo.jpg" alt="5Directions Logo" className="w-9 h-9 rounded-xl object-contain shadow-sm ring-1 ring-deep-navy/10" />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg tracking-tight text-deep-navy leading-tight">5Directions</span>
              <span className="text-xs text-ocean-blue font-semibold uppercase tracking-wider -mt-0.5">Supplier Terminal</span>
            </div>
          </Link>
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#FFFCF7] rounded-2xl border border-deep-navy/10">
            {SUPPLIER_LINKS.map(l => (
              <NavLink key={l.path} to={l.path}
                className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="xl:hidden p-2 rounded-xl hover:bg-warm-cream transition-colors" onClick={() => setMobileOpen(v => !v)}>
            <span className="material-symbols-outlined text-deep-navy text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
          <div className="relative">
            <button
              id="supplier-profile-btn"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border border-deep-navy/10 bg-pure-white hover:bg-warm-cream/30 transition-all text-left"
              onClick={() => setProfileOpen(v => !v)}
            >
              <div className="w-8 h-8 rounded-full bg-ocean-blue text-pure-white flex items-center justify-center font-bold text-sm">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-bold text-xs text-deep-navy leading-tight">{companyName}</span>
                <span className="text-xs text-deep-navy/60 leading-none">{fullName}</span>
              </div>
              <span className={`material-symbols-outlined text-deep-navy/60 text-lg transition-transform ${profileOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-pure-white border border-deep-navy/10 shadow-card-lg p-2 animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-deep-navy/5 mb-1">
                  <p className="text-xs text-ocean-blue uppercase font-bold tracking-wider">Active Session</p>
                  <p className="text-sm text-deep-navy font-semibold truncate">Supplier Profile</p>
                </div>
                <button onClick={handleLogout} id="supplier-logout-btn"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-crimson-red hover:bg-crimson-red/10 transition-colors">
                  <span className="material-symbols-outlined text-base">logout</span>Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="xl:hidden bg-pure-white border-t border-deep-navy/5 px-6 py-4 flex flex-col gap-2 animate-fade-in">
          {SUPPLIER_LINKS.map(l => (
            <NavLink key={l.path} to={l.path}
              className={({ isActive }) => isActive ? 'nav-link-active block' : 'nav-link block'}
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
