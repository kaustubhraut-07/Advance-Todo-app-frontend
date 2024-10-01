'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Todo {
  id: number;
  title: string;
  createdAt: string;
  completed: boolean;
  description: string;
}

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { data: Session } = useSession();
  console.log(Session, "session123");

  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/getalltodosbyuseremail/${Session?.user?.email}/`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [Session?.user?.email]);

  const handleEdit = (id: number) => {
    const todo = todos.find(t => t.id === id);
    console.log(todo,"todo");
    if (todo) {
      router.push({
        pathname: '/edittodo',
        query: {
          pid: todo.id,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
        }
      });
    }
    console.log(`Edit Todo with id: ${id}`);
  };

  const handleDelete = async(id: number) => {
    // Handle delete functionality
    try {
      const data  = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/deletetodo/${id}/`);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
    console.log(`Delete Todo with id: ${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Title</th>
              {/* <th className="px-4 py-2 text-left">Created At</th> */}
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length > 0 &&todos?.map((todo) => (
              <tr key={todo?.id} className="border-b">
                <td className="px-4 py-2">{todo?.title}</td>
                {/* <td className="px-4 py-2">{todo.createdAt}</td> */}
                <td className="px-4 py-2">{todo?.completed ? 'Completed' : 'Not Completed'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(todo?.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(todo?.id)}
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
