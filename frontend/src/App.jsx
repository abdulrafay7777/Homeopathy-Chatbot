import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import ThemeToggle from './components/common/ThemeToggle';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminDashboard from './pages/AdminDashboard';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import HelpSupportPage from './pages/HelpSupportPage';
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <ThemeToggle />

      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route 
          path="/"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/consultation"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/history"
          element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/subscription" 
          element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/knowledge" 
          element={isAuthenticated ? <KnowledgeBasePage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/support" 
          element={isAuthenticated ? <HelpSupportPage /> : <Navigate to="/login" />} 
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;