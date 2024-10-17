'use client';

import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, toggleDarkMode } from '@/app/store/themslice';

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTodo: React.FC<CreateTodoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  const { data: session } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const notify = () => toast('Todo created!');

  const handleThemeChange = () => {
    dispatch(setDarkMode(!isDarkMode));
    toggleDarkMode();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}todo/createTododo/${session?.user?.email}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error creating Todo');
      }

      const data = await response.json();
      console.log('Todo created successfully:', data);
      notify();

      setFormData({
        title: '',
        description: '',
        completed: false,
      });

      router.push('/dashboard');
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isDarkMode ? 'bg-black bg-opacity-80' : 'bg-gray-500 bg-opacity-50'
      } z-50`}
    >
      <div
        className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Create New Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full mt-1 p-2 border rounded ${
                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                }`}
                required
              />
            </label>
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`block w-full mt-1 p-2 border rounded ${
                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                }`}
                required
              />
            </label>
          </div>

          <div className="mb-4">
            <label className={`block mb-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Completed
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                className="ml-2"
              />
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'}`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
            >
              Create Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;
