import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AdsPage from './pages/AdsPage';
import QuickLinksPage from './pages/QuickLinksPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RequireAuth from './components/RequireAuth';
import EventsPage from './pages/EventsPage';
import ImportantNumbersPage from './pages/ImportantNumbersPage';
import PotentialsPage from './pages/PotentialsPage';


function App() {
  return (
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
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/ads"
            element={
              <RequireAuth>
                <AdsPage />
              </RequireAuth>
            }
          />
            <Route
              path="/quick-links"
              element={
                <RequireAuth>
                  <QuickLinksPage />
                </RequireAuth>
              }
            />
            <Route
            path="/events"
            element={
              <RequireAuth>
                <EventsPage />
              </RequireAuth>
            }
          />
            <Route
              path="/important-numbers"
              element={
                <RequireAuth>
                  <ImportantNumbersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/potentials"
              element={
                <RequireAuth>
                  <PotentialsPage />
                </RequireAuth>
              }
            />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
