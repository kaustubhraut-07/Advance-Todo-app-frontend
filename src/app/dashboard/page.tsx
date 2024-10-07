'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface Todo {
  id: number;
  title: string;
  createdAt: string;
  completed: boolean;
  description: string;
}

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: "Buy groceries",
      createdAt: "2023-10-01T10:00:00Z",
      completed: false,
      description: "Milk, Bread, Eggs, and Butter"
    },
    {
      id: 2,
      title: "Complete project report",
      createdAt: "2023-10-02T14:30:00Z",
      completed: false,
      description: "Finalize the draft and send it to the manager"
    },
    {
      id: 3,
      title: "Call plumber",
      createdAt: "2023-10-03T09:15:00Z",
      completed: true,
      description: "Fix the leaking sink in the kitchen"
    },
    {
      id: 4,
      title: "Schedule dentist appointment",
      createdAt: "2023-10-04T11:45:00Z",
      completed: false,
      description: "Routine check-up and cleaning"
    },
    {
      id: 5,
      title: "Read a book",
      createdAt: "2023-10-05T18:00:00Z",
      completed: true,
      description: "Finish reading 'The Great Gatsby'"
    },
    {
      id: 6,
      title: "Buy groceries",
      createdAt: "2023-10-01T10:00:00Z",
      completed: false,
      description: "Milk, Bread, Eggs, and Butter"
    },
    {
      id: 7,
      title: "Complete project report",
      createdAt: "2023-10-02T14:30:00Z",
      completed: false,
      description: "Finalize the draft and send it to the manager"
    },
    {
      id: 8,
      title: "Call plumber",
      createdAt: "2023-10-03T09:15:00Z",
      completed: true,
      description: "Fix the leaking sink in the kitchen"
    },
    {
      id: 9,
      title: "Schedule dentist appointment",
      createdAt: "2023-10-04T11:45:00Z",
      completed: false,
      description: "Routine check-up and cleaning"
    },
    {
      id: 10,
      title: "Read a book",
      createdAt: "2023-10-05T18:00:00Z",
      completed: true,
      description: "Finish reading 'The Great Gatsby'"
    },
    {
      id: 11,
      title: "Call plumber",
      createdAt: "2023-10-03T09:15:00Z",
      completed: true,
      description: "Fix the leaking sink in the kitchen"
    },
    {
      id: 12,
      title: "Schedule dentist appointment",
      createdAt: "2023-10-04T11:45:00Z",
      completed: false,
      description: "Routine check-up and cleaning"
    },
    {
      id: 13,
      title: "Read a book",
      createdAt: "2023-10-05T18:00:00Z",
      completed: true,
      description: "Finish reading 'The Great Gatsby'"
    }
  ]);
  const [filtertodos , setFiltertodos] = useState<Todo[]>(todos);
  const [currentpage , setCurrentpage] = useState(1);
  const { data: Session } = useSession();
  console.log(Session, "session123");
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/getalltodosbyuseremail/${Session?.user?.email}/`);
        setTodos(response.data);
        setFiltertodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [Session?.user?.email]);

  // const handleEdit = (id: number) => {
  //   const todo = todos.find(t => t.id === id);
  //   console.log(todo,"todo");
  //   if (todo) {
  //     router.push({
  //       pathname: '/edittodo',
  //       state : {

  //       }
  //       // query: {
  //       //   pid: todo.id,
  //       //   title: todo.title,
  //       //   description: todo.description,
  //       //   completed: todo.completed,
  //       // }
  //     });
  //   }
  //   console.log(`Edit Todo with id: ${id}`);
  // };



  const handleEdit = (id: number) => {
    const todo = todos.find(t => t.id === id);
    console.log(todo, "todo");
    if (todo) {
      const queryParams = new URLSearchParams({
        id: todo.id.toString(),
        title: todo.title,
        description: todo.description,
        completed: todo.completed.toString(),
      }).toString();

      router.push(`/edittodo?${queryParams}`);
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

  const handleCreateTodos = () => {
    router.push('/createtodo');
  }

  const handleFiltertodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value, "value");

    if (value) {
      const filteredTodos = todos.filter(todo => {
        const matchesTitle = todo.title.toLowerCase().includes(value.toLowerCase());
        // const matchesStatus = todo.completed === true ?  true : false;
        return matchesTitle ;
      });

      setFiltertodos(filteredTodos);
    } else {
      setFiltertodos(todos);
    }

  };
  const indexOfLastTodo = currentpage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = filtertodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const paginate = (pageNumber: number) => setCurrentpage(pageNumber);
  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={handleCreateTodos}>Create Todo</button>
        </div>
        <input onChange={(e)=>handleFiltertodos(e)} placeholder='filter todos' className='border border-gray-800 rounded py-2 px-4 w-full mb-4' />
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
            {currentTodos.length > 0 &&currentTodos?.map((todo) => (
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
        <div className="flex justify-center mt-4">
          <button
            className={`px-3 py-1 mx-1 ${currentpage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            onClick={() => currentpage > 1 && setCurrentpage(currentpage - 1)}
          >Previous</button>
          {Array.from({ length: Math.ceil(filtertodos.length / itemsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 mx-1 ${currentpage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
          <button 
            className={`px-3 py-1 mx-1 ${currentpage === Math.ceil(filtertodos.length / itemsPerPage) ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
           onClick={() => currentpage < Math.ceil(filtertodos.length / itemsPerPage) && setCurrentpage(currentpage + 1)}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
