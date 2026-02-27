import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ResumeManager from './sections/ResumeManager';
import ApplicationsPage from './pages/Applications';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';

import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Main App Routes with Layout */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="resume-manager" element={<ResumeManager />} />
            <Route path="applications" element={<ApplicationsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
