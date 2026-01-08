import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import EditProfile from './components/Profile/EditProfile/EditProfile';
import EditScoutProfile from './components/Profile/EditProfile/EditScoutProfile'; // Nuevo componente
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import AuthPage from './components/Auth/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ScoutProfilePage from './pages/ScoutProfilePage'; // Nuevo componente

// ⬇️ Importamos el botón flotante
import FloatingButton from './components/common/FloatingButton';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rutas para deportistas */}
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
          
          {/* Rutas para scouts */}
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
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* ⬇️ Botón flotante global */}
      <FloatingButton />
    </Router>
  );
}

export default App;