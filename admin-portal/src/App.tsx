import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/layout/Layout';
import RequireAuth from './components/RequireAuth';
import Forbidden403Modal from './components/Forbidden403Modal';
import { ModuleProvider } from './context/ModuleContext';
import { PrimeReactProvider } from './context/PrimeReactProvider';
import './i18n/config';

// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Auth pages
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Website pages
const AdsPage = lazy(() => import('./pages/website/AdsPage'));
const NewsPage = lazy(() => import('./pages/website/NewsPage'));
const SlidersPage = lazy(() => import('./pages/website/SlidersPage'));
const QuickLinksPage = lazy(() => import('./pages/website/QuickLinksPage'));
const EventsPage = lazy(() => import('./pages/website/EventsPage'));
const ImportantNumbersPage = lazy(() => import('./pages/website/ImportantNumbersPage'));
const PotentialsPage = lazy(() => import('./pages/website/PotentialsPage'));
const PapersPage = lazy(() => import('./pages/website/PapersPage'));
const PersonsPage = lazy(() => import('./pages/website/PersonsPage'));

// Admin pages
const UsersPage = lazy(() => import('./pages/admin/users/UsersPage'));
const GroupsPage = lazy(() => import('./pages/admin/groups/GroupsPage'));
const RolesPage = lazy(() => import('./pages/admin/roles/RolesPage'));
const ApplicationsPage = lazy(() => import('./pages/admin/application/ApplicationsPage'));
const StructuresPage = lazy(() => import('./pages/admin/structures/StructuresPage'));
const AdminModulesPage = lazy(() => import('./pages/admin/AdminModulesPage'));

// Super Admin pages
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));

// Claims pages
const CitizenClaimPage = lazy(() => import('./pages/claims/CitizenClaimPage'));
const CompanyClaimPage = lazy(() => import('./pages/claims/CompanyClaimPage'));
const OrganizationClaimPage = lazy(() => import('./pages/claims/OrganizationClaimPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <p>Loading...</p>
  </div>
);


function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set text direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Use REACT_APP_BASENAME from environment, defaults to empty string for local dev
  const basename = process.env.REACT_APP_BASENAME || '';
  
  return (
    <PrimeReactProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<ModuleProvider>
              <Forbidden403Modal />
              <Layout />
            </ModuleProvider>}>
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                }
                />
              
              {/* Admin Module Routes */}
              <Route
                path="/admin/users"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <UsersPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/groups"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <GroupsPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RolesPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ApplicationsPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/structures"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <StructuresPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/modules"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminModulesPage />
                  </Suspense>
                }
              />

              {/* Super Admin Module Routes */}
              <Route
                path="/admin/tools"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <SuperAdminDashboard />
                  </Suspense>
                }
              />

              {/* Claims Module Routes */}
              <Route
                path="/claims/citizen"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CitizenClaimPage />
                  </Suspense>
                }
              />
              <Route
                path="/claims/company"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CompanyClaimPage />
                  </Suspense>
                }
              />
              <Route
                path="/claims/organization"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <OrganizationClaimPage />
                  </Suspense>
                }
              />

              {/* Website Module Routes */}
              <Route
                path="/ads"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AdsPage />
                  </Suspense>
                }
              />
              <Route
                path="/news"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <NewsPage />
                  </Suspense>
                }
              />
              <Route
                path="/sliders"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <SlidersPage />
                  </Suspense>
                }
              />
              <Route
                path="/quick-links"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <QuickLinksPage />
                  </Suspense>
                }
              />
              <Route
                path="/events"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <EventsPage />
                  </Suspense>
                }
              />
              <Route
                path="/papers"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PapersPage />
                  </Suspense>
                }
              />
              <Route
                path="/important-numbers"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ImportantNumbersPage />
                  </Suspense>
                }
              />
              <Route
                path="/potentials"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PotentialsPage />
                  </Suspense>
                }
              />
              <Route
                path="/persons"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PersonsPage />
                  </Suspense>
                }
              />
              </Route>
            </Route>
          </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
