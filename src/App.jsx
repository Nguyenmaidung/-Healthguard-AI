import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import HealthTracking from './pages/HealthTracking'
import BMITracker from './pages/BMITracker'
import SymptomAssistant from './pages/SymptomAssistant'
import MedicationCheck from './pages/MedicationCheck'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Protected Routes with Dashboard Layout */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Profile />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tracking"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <HealthTracking />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bmi"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <BMITracker />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/symptoms"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <SymptomAssistant />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/medication"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <MedicationCheck />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    )
}

export default App
