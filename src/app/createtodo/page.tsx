'use client';

import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, toggleDarkMode } from '@/app/store/themslice';

const Page = () => {
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function handleAddToGoogleCalendar() {
    try {
      const response = await fetch('/api/addtogooglecalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: 'Meeting',
          location: 'New York',
          description: 'Discuss project updates',
          start: '2024-10-07T17:00:00-07:00',
          end: '2024-10-07T17:00:00-08:00',
        }),
      });

      const data = await response.json();
      if (data.message === 'Event created') {
        console.log('Event created successfully:', data.link);
        toast.success('Event added to Calendar successfully!');
      } else {
        console.error('Error creating event:', data.error);
      }
    } catch (error) {
      console.error('Error adding to Google Calendar:', error);
    }
  }

  return (
    <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <form onSubmit={handleSubmit} className={`p-6 rounded shadow-md w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Create Todo</h2>

        <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`block w-full mt-1 p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            required
          />
        </label>

        <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`block w-full mt-1 p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            required
          />
        </label>

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

        <button
          type="submit"
          className={`w-full p-2 m-2 rounded hover:bg-blue-600 transition duration-200 ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
        >
          Create Todo
        </button>

        <button
          onClick={handleAddToGoogleCalendar}
          className={`w-full p-2 m-2 rounded hover:bg-blue-600 transition duration-200 ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
        >
          Google Calendar
        </button>

       
      </form>
      <ToastContainer />
    </div>
  );
};

export default Page;
