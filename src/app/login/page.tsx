'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'

import axios from 'axios';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        // `${process.env.BACKEND_URL}user/login/`
        "http://127.0.0.1:8000/user/login/"
        

        , {
            username :  username,
            password,
      });
      console.log(response.data);
    //   localStorage.setItem('token', response.data.token);
    //   router.push('/dashboard'); 
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">username</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <p className="text-center mt-4">
          Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
