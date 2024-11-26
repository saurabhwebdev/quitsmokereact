import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signupWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setError('');
      setLoading(true);
      const result = await signup(formData.email, formData.password, formData.name);
      if (result) {
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create an account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (loading) return;

    try {
      setError('');
      setLoading(true);
      const result = await signupWithGoogle();
      if (result) {
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      setError('Failed to sign up with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <Logo className="h-8 w-8" />
              <Link 
                to="/" 
                className="text-sm font-medium text-primary hover:text-red-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-1 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-red-700">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-500 p-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - App Features */}
      <div className="hidden lg:flex lg:flex-1 bg-primary/5 relative overflow-hidden">
        <div className="relative w-full flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Main Illustration */}
            <div className="relative">
              {/* Animated Circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-4 border-dashed border-primary/30 animate-spin-slow"/>
                <div className="absolute w-56 h-56 rounded-full border-4 border-dotted border-primary/20 animate-reverse-spin"/>
              </div>

              {/* Feature Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-4 mt-64">
                <div className="bg-white p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-primary text-xl mb-2">🎯</div>
                  <h3 className="text-sm font-semibold mb-1">Track Progress</h3>
                  <p className="text-xs text-gray-600">Monitor your smoke-free journey</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-primary text-xl mb-2">🧘</div>
                  <h3 className="text-sm font-semibold mb-1">Breathing Exercises</h3>
                  <p className="text-xs text-gray-600">Manage stress and cravings</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-primary text-xl mb-2">💪</div>
                  <h3 className="text-sm font-semibold mb-1">Craving Control</h3>
                  <p className="text-xs text-gray-600">Track and manage urges</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-primary text-xl mb-2">💰</div>
                  <h3 className="text-sm font-semibold mb-1">Money Saved</h3>
                  <p className="text-xs text-gray-600">Watch your savings grow</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 left-10 animate-float">
                <div className="w-12 h-12 bg-primary/10 rounded-full" />
              </div>
              <div className="absolute top-40 right-10 animate-float-delay">
                <div className="w-8 h-8 bg-primary/20 rounded-full" />
              </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg className="w-full" viewBox="0 0 1440 120" fill="none">
                <path 
                  d="M0 0L48 8.85C96 17.7 192 35.4 288 42.85C384 50.3 480 47.7 576 38.85C672 30 768 15 864 12.85C960 10.7 1056 21.7 1152 25.35C1248 29 1344 25.3 1392 23.5L1440 21.7V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" 
                  fill="currentColor" 
                  className="text-primary/5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 