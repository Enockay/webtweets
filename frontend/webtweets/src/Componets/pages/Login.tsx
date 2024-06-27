// src/Components/pages/Login.tsx
import React, { useState } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useUser } from '../Context';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://webtweets-dawn-forest-2637.fly.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        console.log('Login successful:', data);
        setUser(data.user); // Set user data in context
        localStorage.setItem('user', JSON.stringify(data.user)); // Set user data in localStorage
        navigate('/Dashboard');
      } else {
        console.error('Login failed:', data);
      }
    } catch (err) {
      setLoading(false);
      console.error('Server error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-slate-500 p-4 sm:p-6 lg:p-8">
      <div className=" fixed  max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg">
        <h4 className="text-xl font-extrabold text-center text-lime-400">Webtweets Login</h4>
        <p className="text-center text-green-400">Please enter your login and your password</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mt-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <ClipLoader size={20} color={"#ffffff"} loading={loading} />
              ) : (
                'Login'
              )}
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <FaTwitter className="mr-2 text-blue-500" />
            <a
              href="https://webtweets-dawn-forest-2637.fly.dev/auth/twitter"
              className="text-sm font-medium text-green-400 hover:underline"
            >
              Login with Twitter
            </a>
          </div>
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm text-lime-400">Don't have an account?</p>
            <Link
              to="/signup"
              className="ml-2 text-sm font-medium text-blue-500 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
