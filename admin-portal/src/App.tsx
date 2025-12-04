import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/layout/Layout';
import RequireAuth from './components/RequireAuth';
import { ModuleProvider } from './context/ModuleContext';
import { PrimeReactProvider } from './context/PrimeReactProvider';

// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Auth pages
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Website pages
const AdsPage = lazy(() => import('./pages/website/AdsPage'));
const NewsPage = lazy(() => import('./pages/website/NewsPage'));
const QuickLinksPage = lazy(() => import('./pages/website/QuickLinksPage'));
const EventsPage = lazy(() => import('./pages/website/EventsPage'));
const ImportantNumbersPage = lazy(() => import('./pages/website/ImportantNumbersPage'));
const PotentialsPage = lazy(() => import('./pages/website/PotentialsPage'));
const PapersPage = lazy(() => import('./pages/website/PapersPage'));
const PersonsPage = lazy(() => import('./pages/website/PersonsPage'));

// Admin pages
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const GroupsPage = lazy(() => import('./pages/admin/GroupsPage'));
const RolesPage = lazy(() => import('./pages/admin/RolesPage'));
const ApplicationsPage = lazy(() => import('./pages/admin/ApplicationsPage'));
const StructuresPage = lazy(() => import('./pages/admin/StructuresPage'));

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
  return (
    <PrimeReactProvider>
      <ModuleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth redirectDelay={2000}>
                      <Dashboard />
                    </RequireAuth>
                  </Suspense>
                }
              />
              
              {/* Admin Module Routes */}
              <Route
                path="/admin/users"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <UsersPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/admin/groups"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <GroupsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <RolesPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <ApplicationsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/admin/structures"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <StructuresPage />
                    </RequireAuth>
                  </Suspense>
                }
              />

              {/* Claims Module Routes */}
              <Route
                path="/claims/citizen"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <CitizenClaimPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/claims/company"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <CompanyClaimPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/claims/organization"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <OrganizationClaimPage />
                    </RequireAuth>
                  </Suspense>
                }
              />

              {/* Website Module Routes */}
              <Route
                path="/ads"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <AdsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/news"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <NewsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/quick-links"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <QuickLinksPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/events"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <EventsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/papers"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <PapersPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/important-numbers"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <ImportantNumbersPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/potentials"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <PotentialsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/persons"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RequireAuth>
                      <PersonsPage />
                    </RequireAuth>
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModuleProvider>
    </PrimeReactProvider>
  );
}

export default App;
