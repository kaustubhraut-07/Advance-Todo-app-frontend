'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, toggleDarkMode } from '@/app/store/themslice';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface PageProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
}

const EditTodo: React.FC<PageProps> = ({ todo: initialTodo, isOpen, onClose }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  const notify = () => toast('Todo Edited Successfully!');

  useEffect(() => {
    if (initialTodo) {
      setTodo(initialTodo);
      setTitle(initialTodo.title);
      setDescription(initialTodo.description);
      setCompleted(initialTodo.completed);
    }
  }, [initialTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    const updatedTodo = { ...todo, title, description, completed };

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/updatetodo/${todo.id}/`, updatedTodo);
      notify();
      onClose();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`max-w-lg w-full p-5 border rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-5">Edit Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring ${
                isDarkMode
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                  : 'bg-white text-black border-gray-300 focus:ring-blue-300'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring ${
                isDarkMode
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                  : 'bg-white text-black border-gray-300 focus:ring-blue-300'
              }`}
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
            <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="completed">
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
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded shadow ml-2 hover:bg-red-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditTodo;
