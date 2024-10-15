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
import CreateTodo from '../createtodo/page';
import EditTodo from '../edittodo/page';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
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
  }, [session?.user]);

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

  const handleSort = (key: keyof Todo) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    const sortedTodos = [...filtertodos].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFiltertodos(sortedTodos);
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
    setIsModalOpen(true);
  };

  const handleEditTodo = () => {
    setIsEditModalOpen(true);
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
      setFiltertodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? { ...t, loading: false } : t))
      );
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const paginate = (pageNumber: number) => setCurrentpage(pageNumber);

  const handleOnDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const todoId = parseInt(draggableId, 10);
    const updatedTodo = todos.find((todo) => todo.id === todoId);

    if (updatedTodo) {
      updatedTodo.completed = destination.droppableId === 'completed';

      try {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/updatetodo/${updatedTodo.id}/`, updatedTodo);
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: updatedTodo.completed } : todo))
        );
        setFiltertodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: updatedTodo.completed } : todo))
        );
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  const notCompletedTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className='min-h-screen'>
          <div className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
            <ToastContainer />
            <div className="container mx-auto px-4 py-8 h-screen">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
                <button
                  className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
                  onClick={handleCreateTodos}
                >
                  Create Todo
                </button>
              </div>
              <CreateTodo isOpen={isModalOpen} onClose={handleCloseModal} />
              <input
                onChange={handleFiltertodos}
                placeholder="Filter todos"
                className={`border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-800 bg-white text-black'} rounded py-2 px-4 w-full mb-4`}
              />
              <div className="flex space-x-4">
                <Droppable droppableId="not-completed">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-1/2 p-4 ${snapshot.isDraggingOver ? 'bg-gray-200' : 'bg-white'} rounded shadow`}
                    >
                      <h2 className="text-xl font-bold mb-4">Not Completed</h2>
                      {notCompletedTodos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-2 ${snapshot.isDragging ? 'bg-gray-300' : 'bg-white'} rounded shadow`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold">{todo.title}</h3>
                                  <p>{todo.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
                                    onClick={() => handleEdit(todo.id)}
                                  >
                                    Edit
                                  </button>
                                  <EditTodo isOpen={isEditModalOpen} onClose={handleCloseEditModal} todo={todo} />
                                  <button
                                    className={`${isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1 rounded`}
                                    onClick={() => handleDelete(todo.id)}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => handleAddToGoogleCalendar(todo)}
                                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} w-full text-white text-sm p-2 m-2 rounded transition duration-200`}
                                  >
                                    Add to Google Calendar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="completed">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-1/2 p-4 ${snapshot.isDraggingOver ? 'bg-gray-200' : 'bg-white'} rounded shadow`}
                    >
                      <h2 className="text-xl font-bold mb-4">Completed</h2>
                      {completedTodos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-2 ${snapshot.isDragging ? 'bg-gray-300' : 'bg-white'} rounded shadow`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold">{todo.title}</h3>
                                  <p>{todo.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
                                    onClick={() => handleEdit(todo.id)}
                                  >
                                    Edit
                                  </button>
                                  <EditTodo isOpen={isEditModalOpen} onClose={handleCloseEditModal} todo={todo} />
                                  <button
                                    className={`${isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1 rounded`}
                                    onClick={() => handleDelete(todo.id)}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => handleAddToGoogleCalendar(todo)}
                                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} w-full text-white text-sm p-2 m-2 rounded transition duration-200`}
                                  >
                                    Add to Google Calendar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
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
                    className={`px-4 py-2 border ${number === currentpage
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
      </DragDropContext>
    </>
  );
};

export default DashboardPage;
