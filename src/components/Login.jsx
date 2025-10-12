import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
   const navigatedRef = useRef(false); // guard

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://college-even-backend-2.onrender.com/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
     if (!navigatedRef.current) {
        navigatedRef.current = true;
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      alert("Invalid email or password");
    }
  };

  useEffect(() => {
    // run only once on mount
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !navigatedRef.current) {
      navigatedRef.current = true;
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="loginEmail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="loginPassword"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;