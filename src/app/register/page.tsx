'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Link from 'next/link';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}user/register/`
                // 'http://127.0.0.1:8000/user/register/'
                , {
                username,
                password,
                name,
                email,
            });
            // Handle successful registration, e.g., redirect to login page
            router.push('/login');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
