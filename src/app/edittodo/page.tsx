'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const EditTodo: React.FC<PageProps> = ({ searchParams }) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const id = searchParams.id;
    const title = searchParams.title;
    const description = searchParams.description;
    const completed = searchParams.completed;

    if (id && title && description) {
      setTodo({
        id: Number(id),
        title: String(title),
        description: String(description),
        completed: completed === 'true',
      });
      setTitle(String(title));
      setDescription(String(description));
      setCompleted(completed === 'true');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    const updatedTodo = { ...todo, title, description, completed };
    
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/updatetodo/${todo.id}/`, updatedTodo);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (!todo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-5">Edit Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
            rows={4}
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700" htmlFor="completed">
            Completed
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
            Update Todo
          </button>
        </div>
      </form>
      {session?.user && (
        <div className="mt-4 text-center">
          <p>Editing as: {session.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default EditTodo;