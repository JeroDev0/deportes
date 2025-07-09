import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/PrivateRoute';
import EditProfile from './components/Profile/EditProfile';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import AuthPage from './components/Auth/AuthPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <main style={{ padding: 0, height: '100vh', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile/:id/edit" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
    </Router>
  );
}

export default App;