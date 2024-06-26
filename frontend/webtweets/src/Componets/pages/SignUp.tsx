// src/pages/SignUp.tsx
import React, { useState } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://webtweets-dawn-forest-2637.fly.dev/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Handle successful signup (e.g., redirect to login)
        console.log('Signup successful:', data);
      } else {
        // Handle error response
        console.error('Signup failed:', data.message);
      }
    } catch (err) {
      console.error('Server error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Webtweets Sign Up</h2>
        <p className="text-center text-gray-600">Create your account</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mt-4">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              Sign Up
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <FaTwitter className="mr-2 text-blue-500" />
            <a
              href="https://webtweets-dawn-forest-2637.fly.dev/auth/twitter"
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Sign Up with Twitter
            </a>
          </div>
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm text-gray-600">Already have an account?</p>
            <Link
              to="/login"
              className="ml-2 text-sm font-medium text-blue-500 hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
