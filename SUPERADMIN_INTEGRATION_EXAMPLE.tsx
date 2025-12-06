// Example integration of Super Admin module into your existing React app
// Add this to your admin-portal/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import RequireAuth from './components/RequireAuth';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ... existing routes ... */}
        
        {/* Super Admin Route - Add this */}
        <Route
          path="/admin/superadmin"
          element={
            <RequireAuth>
              <Layout>
                <SuperAdminDashboard />
              </Layout>
            </RequireAuth>
          }
        />
        
        {/* ... other admin routes ... */}
      </Routes>
    </Router>
  );
};

export default App;

// ============================================
// Also update your Sidebar.tsx to add navigation link
// Add this to admin-portal/src/components/layout/Sidebar.tsx
// ============================================

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <nav>
        {/* ... existing links ... */}
        
        {/* Add Super Admin link */}
        <Link to="/admin/superadmin" className="sidebar-link">
          <i className="pi pi-cog"></i>
          <span>{t('superadmin.title', 'Super Admin')}</span>
        </Link>
        
        {/* ... other links ... */}
      </nav>
    </aside>
  );
};

export default Sidebar;

// ============================================
// Sidebar.css - Add these styles
// ============================================

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.sidebar-link.active {
  background: #3b82f6;
  color: white;
}

.sidebar-link i {
  font-size: 1.2rem;
}
