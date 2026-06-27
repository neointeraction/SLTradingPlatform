import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentOrchestratorPage } from './pages/AgentOrchestratorPage';
import { AutoTradePage } from './pages/AutoTradePage';
import { Layout } from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Authentication Page (Login and Register) */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes wrapped in Dashboard Layout */}
            <Route 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/orchestrator" element={<AgentOrchestratorPage />} />
              <Route path="/auto-trade" element={<AutoTradePage />} />
            </Route>
            
            {/* Catch-all Route: Unauthenticated goes to /login, Authenticated goes to /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
