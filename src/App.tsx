import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import { SettingsProvider } from './store/SettingsContext';
import { ToastProvider } from './components/ToastProvider';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Requests } from './pages/Requests';
import { Supervisor } from './pages/Supervisor';
import { Warehouse } from './pages/Warehouse';
import { Purchasing } from './pages/Purchasing';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/supervisor" element={<Supervisor />} />
                  <Route path="/warehouse" element={<Warehouse />} />
                  <Route path="/purchasing" element={<Purchasing />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

