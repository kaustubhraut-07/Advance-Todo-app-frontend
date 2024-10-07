'use client'

import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const page = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  })
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const router = useRouter();
  const handleChange = (e : any) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }
  const {data : Session} = useSession();
  const notify = () => toast("Todo created!");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}todo/createTododo/${Session?.user?.email}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Error creating Todo')
      }
      
      const data = await response.json()
      console.log('Todo created successfully:', data)
      notify();
      
      
      setFormData({
        title: '',
        description: '',
        completed: false,
      })

      router.push('/dashboard')
      
    } catch (error) {
      console.error('Error:', error)
    }
  };


  const testing = {
    title: 'Test Title',
    description: 'Test Description',
    completed: true,
    dueDate: '2022-01-01T00:00:00.000Z',
  };
  


  async function handleAddToGoogleCalendar() {
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
            attendees: [{ email: 'kaustubhr2001@gmail.com' }, { email: 'kaustubh.raut@fxis.ai' }],
        }),
    });

    const data = await response.json();
    if (data.message === 'Event created') {
        console.log('Event created successfully:', data.link);
        toast.success('Event Added to Calender successfully!');
    } else {
        console.error('Error creating event:', data.error);
    }
}
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Todo</h2>

        <label className="block mb-2 text-gray-700">
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2 text-gray-700">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-4 text-gray-700">
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
          className="w-full bg-blue-500 text-white p-2 m-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Create Todo
        </button>
        <button onClick={handleAddToGoogleCalendar}
        className="w-full bg-blue-500 text-white p-2 m-2 rounded hover:bg-blue-600 transition duration-200 "
>
          Google Calender
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default page
