// src/Components/LoginModal.tsx
import React, { useState } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useUser } from '../Context';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../Context';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://webtweets-dawn-forest-2637.fly.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        const token = data.token;
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUser(decodedToken.user)
        localStorage.setItem('token', token);
        navigate('/Dashboard', { replace: true }); 
      } else {
        console.error('Login failed:', data);
      }
    } catch (err) {
      setLoading(false);
      console.error('Server error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg">
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
        </form>
        <button onClick={onClose} className="mt-4 text-red-500">Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
