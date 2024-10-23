'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RootState } from '@/app/store';
import CreateTodo from '../createtodo/page';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  useDraggable, 
  TouchSensor
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableTodoItem from './SortableItem';
import { useSelector } from 'react-redux';

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
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5} }),
    useSensor(TouchSensor, {
     
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (session?.user?.email) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}todo/getalltodosbyuseremail/${session.user.email}/`
          );
          setTodos(response.data);
          setFilteredTodos(response.data); 
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [session?.user]);

  useEffect(() => {
    // Filter todos based on the search query
    const result = todos.filter(todo =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTodos(result);
  }, [searchQuery, todos]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (id: number) => {
    // router.push(`/edittodo?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/deletetodo/${id}/`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const handleOnDragEnd = async ( event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const todoId = parseInt(active.id, 10);
      const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}todo/updatetodo/${todoId}/`,
            updatedTodo
          );
          return updatedTodo;
        }
        return todo;
      });
      setTodos(updatedTodos);
      toast.success('Todo status updated successfully');
    }
  };

  const notCompletedTodos = filteredTodos.filter((todo) => !todo.completed);
  const completedTodos = filteredTodos.filter((todo) => todo.completed);

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOnDragEnd}>
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
          <ToastContainer />
          <div className="container mx-auto px-4 py-8 h-screen">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
              <button
                className={`${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-3 py-1 rounded`}
                onClick={() => setIsModalOpen(true)}
              >
                Create Todo
              </button>
            </div>

            <CreateTodo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={handleSearchChange}
              className={`w-full p-2 mb-4 rounded ${
                isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-600'
              }`}
            />

            <div className="flex space-x-4">
              <SortableContext items={notCompletedTodos.map(todo => todo.id.toString())} strategy={verticalListSortingStrategy}>
                <div
                  id="not-completed"
                  className={`w-1/2 p-4 rounded shadow ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
                  }`}
                >
                  <h2 className="text-xl font-bold mb-4">Not Completed</h2>
                  {notCompletedTodos.map((todo) => (
                    <SortableTodoItem key={todo.id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              </SortableContext>

              <SortableContext items={completedTodos.map(todo => todo.id.toString())} strategy={verticalListSortingStrategy}>
                <div
                  id="completed"
                  className={`w-1/2 p-4 rounded shadow ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
                  }`}
                >
                  <h2 className="text-xl font-bold mb-4">Completed</h2>
                  {completedTodos.map((todo) => (
                    <SortableTodoItem key={todo.id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
};

export default DashboardPage;
