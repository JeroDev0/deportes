import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

import EditProfile from './components/Profile/EditProfile/EditProfile';
import EditScoutProfile from './components/Profile/EditProfile/EditScoutProfile';
import EditSponsorProfile from './components/Profile/EditProfile/EditSponsorProfile';

import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import AuthPage from './components/Auth/AuthPage';

import ProfilePage from './pages/ProfilePage';
import ScoutProfilePage from './pages/ScoutProfilePage';
import SponsorProfilePage from './pages/SponsorProfilePage';

import FloatingButton from './components/common/FloatingButton';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ================= DEPORTISTAS ================= */}
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id/edit"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          {/* ================= SCOUTS ================= */}
          <Route
            path="/scout-profile/:id"
            element={
              <PrivateRoute>
                <ScoutProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/scout-profile/:id/edit"
            element={
              <PrivateRoute>
                <EditScoutProfile />
              </PrivateRoute>
            }
          />

          {/* ================= SPONSORS ================= */}
          <Route
            path="/sponsor-profile/:id"
            element={
              <PrivateRoute>
                <SponsorProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sponsor-profile/:id/edit"
            element={
              <PrivateRoute>
                <EditSponsorProfile />
              </PrivateRoute>
            }
          />

          {/* ================= OTROS ================= */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin-panel" element={<AdminDashboard />} />
        </Routes>
      </div>

      <FloatingButton />
    </Router>
  );
}

export default App;