'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar/page';

interface Todo {
  id: number;
  title: string;
  createdAt: string;
  status: string;
}

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const handleEdit = (id: number) => {
    // Handle edit functionality
    console.log(`Edit Todo with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Handle delete functionality
    console.log(`Delete Todo with id: ${id}`);
  };

  return (
    <div><Navbar/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} className="border-b">
              <td className="px-4 py-2">{todo.title}</td>
              <td className="px-4 py-2">{new Date(todo.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">{todo.status}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleEdit(todo.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default DashboardPage;
