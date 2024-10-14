'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setDarkMode, toggleDarkMode } from '@/app/store/themslice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';

interface Todo {
  id: number;
  title: string;
  createdAt: string;
  completed: boolean;
  description: string;
  startDate?: string;
  endDate?: string;
  loading?: boolean;
}

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtertodos, setFiltertodos] = useState<Todo[]>(todos);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const { data: session } = useSession();
  const itemsPerPage = 5;
  const router = useRouter();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (session?.user?.email) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}todo/getalltodosbyuseremail/${session.user.email}/`
          );
          const todosWithLoading = response.data.map((todo: Todo) => ({
            ...todo,
            loading: false,
          }));
          setTodos(todosWithLoading);
          setFiltertodos(todosWithLoading);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [session?.user?.email]);

  const handleEdit = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const queryParams = new URLSearchParams({
        id: todo.id.toString(),
        title: todo.title,
        description: todo.description,
        completed: todo.completed.toString(),
      }).toString();

      router.push(`/edittodo?${queryParams}`);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/deletetodo/${id}/`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setFiltertodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const handleCreateTodos = () => {
    router.push('/createtodo');
  };

  const handleFiltertodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(value.toLowerCase())
      );
      setFiltertodos(filteredTodos);
    } else {
      setFiltertodos(todos);
    }
  };

  const indexOfLastTodo = currentpage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = filtertodos.slice(indexOfFirstTodo, indexOfLastTodo);

  async function handleAddToGoogleCalendar(todo: Todo) {
    if (!todo.startDate || !todo.endDate) {
      toast.error('Please select both start and end date and time.');
      return;
    }

    const eventSummary = todo.title;
    const eventDescription = todo.description;
    const eventLocation = 'Remote';

    
    // setTodos((prevTodos) =>
    //   prevTodos.map((t) => (t.id === todo.id ? { ...t, loading: true } : t))
    // );
    setFiltertodos((prevTodos) => prevTodos.map((t) => (t.id === todo.id ? { ...t, loading: true } : t)));

    try {
      const response = await fetch('/api/addtogooglecalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: eventSummary,
          location: eventLocation,
          description: eventDescription,
          start: todo.startDate,
          end: todo.endDate,
        }),
      });

      const data = await response.json();
      if (data.message === 'Event created') {
        toast.success('Event added to Google Calendar successfully!');
      } else {
        toast.error('Error creating event in Google Calendar');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event in Google Calendar');
    } finally {
     
      // setTodos((prevTodos) =>
      //   prevTodos.map((t) => (t.id === todo.id ? { ...t, loading: false } : t))
      // );
      setFiltertodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? { ...t, loading: false } : t))
      );
     
    }
  }

  const paginate = (pageNumber: number) => setCurrentpage(pageNumber);
  console.log(todos , "todos");
  return (
    <div className='min-h-screen'>
      <div className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
        <ToastContainer />
        <div className="container mx-auto px-4 py-8 h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
            <button
              className={`${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white px-3 py-1 rounded`}
              onClick={handleCreateTodos}
            >
              Create Todo
            </button>
          </div>
          <input
            onChange={handleFiltertodos}
            placeholder="Filter todos"
            className={`border ${
              isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-800 bg-white text-black'
            } rounded py-2 px-4 w-full mb-4`}
          />
          <table className="min-w-full table-auto">
            <thead>
              <tr className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Start Date Time</th>
                <th className="px-4 py-2 text-left">End Date Time</th>
                <th className="px-4 py-2 text-left">Actions</th>
                <th className="px-4 py-2 text-left">Add to Calendar</th>
              </tr>
            </thead>
            <tbody>
              {currentTodos.map((todo) => (
                <tr key={todo.id} className={isDarkMode ? 'border-b border-gray-600' : 'border-b'}>
                  <td className="px-4 py-2">{todo.title}</td>
                  <td className="px-4 py-2">{todo.completed ? 'Completed' : 'Not Completed'}</td>
                  <td className="px-4 py-2">
                    <input
                      type="datetime-local"
                      className={isDarkMode ? 'bg-gray-700 text-white' : ''}
                      onChange={(e) => {
                        const updatedTodos = todos.map((t) =>
                          t.id === todo.id ? { ...t, startDate: e.target.value } : t
                        );
                        setTodos(updatedTodos);
                        setFiltertodos(updatedTodos);
                      }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="datetime-local"
                      className={isDarkMode ? 'bg-gray-700 text-white' : ''}
                      onChange={(e) => {
                        const updatedTodos = todos.map((t) =>
                          t.id === todo.id ? { ...t, endDate: e.target.value } : t
                        );
                        setTodos(updatedTodos);
                        setFiltertodos(updatedTodos);
                      }}
                    />
                  </td>
                  <td className="flex justify-center items-center px-4 py-2 space-x-2">
                    <button
                      className={`${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white px-3 py-1 rounded`}
                      onClick={() => handleEdit(todo.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${
                        isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
                      } text-white px-3 py-1 rounded`}
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </td>
                  
                  <td>
             
                    {todo.loading ? (
                        <>

                          <button className={`${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                        } w-full text-white text-sm p-2 m-2 rounded transition duration-200 flex justify-center `} disabled>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
          
                           
                          </button>
                          </> 
                      ) : (
                      <button
                        onClick={() => handleAddToGoogleCalendar(todo)}
                        className={`${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                        } w-full text-white text-sm p-2 m-2 rounded transition duration-200`}
                      >
                        Add to Google Calendar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            {currentpage !== 1 && (
              <button
                onClick={() => currentpage > 1 && setCurrentpage(currentpage - 1)}
                className={`px-4 py-2 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-blue-500'}`}
              >
                Previous
              </button>
            )}
            {Array.from({ length: Math.ceil(filtertodos.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 border ${
                  number === currentpage
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-blue-500'
                }`}
              >
                {number}
              </button>
            ))}
            {currentpage !== Math.ceil(filtertodos.length / itemsPerPage) && (
              <button
                onClick={() => currentpage < Math.ceil(filtertodos.length / itemsPerPage) && setCurrentpage(currentpage + 1)}
                className={`px-4 py-2 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-blue-500'}`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
