import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthGuard from './components/auth/AuthGuard'
import DemoBanner from './components/layout/DemoBanner'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import Landing        from './pages/Landing'
import SignIn         from './pages/auth/SignIn'
import SignUp         from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'

// Company
import CompanyDashboard    from './pages/company/Dashboard'
import FindMaterials       from './pages/company/FindMaterials'
import CompareSuppliers    from './pages/company/CompareSuppliers'
import CompanyOrders       from './pages/company/Orders'

// Supplier
import SupplierDashboard   from './pages/supplier/Dashboard'
import MyMaterials         from './pages/supplier/MyMaterials'
import CompanyRequests     from './pages/supplier/CompanyRequests'
import MyOrders            from './pages/supplier/MyOrders'

function RoleRedirect() {
  const { user, role, loading } = useAuth()
  if (loading) return null
  if (!user)              return <Navigate to="/sign-in" replace />
  if (role === 'supplier') return <Navigate to="/supplier/dashboard" replace />
  if (role === 'company')  return <Navigate to="/company/dashboard" replace />
  return <Navigate to="/sign-in" replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <DemoBanner />
        <div className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/"               element={<Landing />} />
            <Route path="/sign-in"        element={<SignIn />} />
            <Route path="/sign-up"        element={<SignUp />} />
            <Route path="/forgot-password"element={<ForgotPassword />} />

            {/* Auto-redirect after login */}
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Company Routes */}
            <Route path="/company/dashboard"         element={<AuthGuard requiredRole="company"><CompanyDashboard /></AuthGuard>} />
            <Route path="/company/find-materials"    element={<AuthGuard requiredRole="company"><FindMaterials /></AuthGuard>} />
            <Route path="/company/compare-suppliers" element={<AuthGuard requiredRole="company"><CompareSuppliers /></AuthGuard>} />
            <Route path="/company/orders"            element={<AuthGuard requiredRole="company"><CompanyOrders /></AuthGuard>} />

            {/* Supplier Routes */}
            <Route path="/supplier/dashboard"        element={<AuthGuard requiredRole="supplier"><SupplierDashboard /></AuthGuard>} />
            <Route path="/supplier/my-materials"     element={<AuthGuard requiredRole="supplier"><MyMaterials /></AuthGuard>} />
            <Route path="/supplier/company-requests" element={<AuthGuard requiredRole="supplier"><CompanyRequests /></AuthGuard>} />
            <Route path="/supplier/my-orders"        element={<AuthGuard requiredRole="supplier"><MyOrders /></AuthGuard>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  )
}
