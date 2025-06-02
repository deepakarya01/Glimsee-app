// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess, setLoading, setError } from '../feeatures/authSlice'
import glimseeLogo from '../assets/Glimsee2.png'

axios.defaults.withCredentials = true;

function LoginPage() {
  const { isLoading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true)); 
    dispatch(setError(null)); 

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      dispatch(loginSuccess(response.data.user));
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      dispatch(setError(err.response?.data?.error || 'Failed to login. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex w-full max-w-5xl">
        {/* Logo Section (Left) */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={glimseeLogo} alt="Glimsee Logo" className="max-w-xs h-auto" />
        </div>

        {/* Form Section (Right) */}
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Glimsee</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
            </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-glimsee-primary to-glimsee-secondary text-white font-bold hover:from-glimsee-secondary hover:to-glimsee-primary py-2 px-4 rounded-lg hover:shadow-md transition ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Login'}
              </button>
            </div>
          </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-glimsee-primary hover:underline font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;