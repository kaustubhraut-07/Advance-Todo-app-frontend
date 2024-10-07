'use client'

import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// import { useCookies } from 'cookies-next';


// import { getCookie } from 'cookies-next';
const page = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  })
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  


  // const handleAddToGoogleCalendar = async (e: React.FormEvent) => {
  //   e.preventDefault();
  
  //   if (!Session) {
  //     console.error('User not authenticated');
  //     return;
  //   }
  
  //   try {
  //     const accessToken = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..PLlixm6PZ4y8tht6.nkAV0pBMB5TkjvRUb5ueYxjucWkmezhUCo556WwEdN-wVZRbYW4kBvse6qaM8DBOoZyIOpJtEBurwaArOBlT2mOYcJE6E6IQnNtd-uZwDCq7pnt8LKuuav3gyEOrYtabglnNkBVuglzP0ozyT5bZlZnlRdWIGlkxcJxfW7jhCrj7wW-jNIT1C1Bt1q69Eb8onK-OS5lGm0B2UgL_OH0Av7Fnqf7p3dICQBi5Zi_2Q8_UX5vGkyAa5qky5OJtSATBNGy56e8sGnFhicrYki6LK-pqmPLAZbBsOM8D5n99HwUGgve-jTjs4YDdCcTB3kjj5U6XgoZEAGtLMiW6zW_0m3HEx5cjl6QhK1W0GdV-iM0YSLdwdB9HLAyvigjrAOxy9ZSMab-81FwQ4dN5V5FMZlL2GVBvl2jsmJOwfEDj04Weuh3fnSnCSjNhkoi13R1muCqIZNjnUseRH-wjxFetZ_iurOBrinWlJfbnYm1bCmP4FOXlQ7kQy1quEDkrZ3K5s_Hh-bVOVMKLO2c2QIc_vsM31GbBT0XEBQaNl5tHjG2ODomDw0ShqQqmlOiSvvQ_ih5RWW6Y4_fsiUPsV0KkTN-F6IsUm4M2eUuPIlmlvf8s0UfuH1jmeJc3-KdAEtXdUAkHkpLxoT71KH7kFBfgW65QbSUO2OaoujdusNYGeEP150baZiLLoF2ciaCiCW9_2bjfLYPcRczEKs6nlGgISgCx5NJNI6KjxGDOwoedakVW-_X5EeOAkfNwIyQRFfLCXFqbtnvG-H-qhdvkRC9OfwfEIHSSPmXOFilJ9PReGTwrSq7xgxLI61k0TJ-PU7hNdF0AAmg7eEIgrAB9N-1jNxT83vbXNGronCIjXh08jQ.a-eMTbw0rsoHEZzDh7XSlQ";
  //      const response = await fetch('/api/addtogooglecalendar', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         todo: testing,
  //         accessToken: accessToken,
  //       }),
  //     });
  //     console.log(response , "res");
  //     if (!response.ok) {
  //       throw new Error('Failed to add event to Google Calendar');
  //     }
  
  //     const data = await response.json();
  //     console.log('Event added to Google Calendar:', data.eventLink);
  //   } catch (error) {
  //     console.error('Error creating event in Google Calendar:', error);
  //   }
  // };

            
  // const handleAddToGoogleCalendar = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!Session ) {
  //     console.error('User is not authenticated');
  //     return;
  //   }
  //   console.log(Session.accessToken , "123123123");

  //   try {
  //     const response = await fetch('/api/addtogooglecalendar', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         todo :testing,
  //         accessToken: Session.accessToken
  //         ,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert('Event added to Google Calendar: ' + data.eventLink);
  //     } else {
  //       console.error('Error:', data.error);
  //     }
  //   } catch (error) {
  //     console.error('Error adding event to Google Calendar:', error);
  //   }
  // };

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
