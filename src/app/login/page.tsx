'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react'; 
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, toggleDarkMode } from '@/app/store/themslice';

const LoginPage: React.FC = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  
  const { data: session } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/login/`,
        {
          email: email,
          password,
        }
      );
      console.log(response.data);
      router.push('/dashboard'); 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signIn('google', { redirect: false });
    console.log(result, "result");
    if (result?.error) {
      setError("Google sign-in failed. Please try again.");
    } else if (result?.ok) {
      router.push('/dashboard'); 
    }
  };

  useEffect(() => {
    if (session) {
      router.push('/dashboard'); 
    }
  }, [session]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-8 rounded shadow-md w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block">{isDarkMode ? 'text-gray-300' : 'text-gray-700'}</label>
            <input
              type="text"
              id="email"
              className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`}
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block">{isDarkMode ? 'text-gray-300' : 'text-gray-700'}</label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
        >
          Sign in with Google
        </button>
        <p className="text-center mt-4">
          Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
