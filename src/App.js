import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import WelcomeForm from './components/WelcomeForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Breathing from './components/Breathing';
import Cravings from './components/Cravings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route path="/welcome" element={
              <PrivateRoute>
                <WelcomeForm />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <div>
                  <Navbar />
                  <Dashboard />
                </div>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <div>
                  <Navbar />
                  <Profile />
                </div>
              </PrivateRoute>
            } />
            <Route path="/breathing" element={
              <PrivateRoute>
                <div>
                  <Navbar />
                  <Breathing />
                </div>
              </PrivateRoute>
            } />
            <Route path="/cravings" element={
              <PrivateRoute>
                <div>
                  <Navbar />
                  <Cravings />
                </div>
              </PrivateRoute>
            } />

            {/* Root route */}
            <Route path="/" element={
              <PrivateRoute>
                <Navigate to="/dashboard" replace />
              </PrivateRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
