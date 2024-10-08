// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from '../navbar/page';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// interface Todo {
//   id: number;
//   title: string;
//   createdAt: string;
//   completed: boolean;
//   description: string;
// }

// const DashboardPage: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [filtertodos, setFiltertodos] = useState<Todo[]>(todos);
//   const [currentpage, setCurrentpage] = useState(1);
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');
//   const { data: Session } = useSession();
//   const itemsPerPage = 5;
//   const router = useRouter();

//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}todo/getalltodosbyuseremail/${Session?.user?.email}/`
//         );
//         setTodos(response.data);
//         setFiltertodos(response.data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };
//     fetchTodos();
//   }, [Session?.user?.email]);

//   const handleEdit = (id: number) => {
//     const todo = todos.find((t) => t.id === id);
//     if (todo) {
//       const queryParams = new URLSearchParams({
//         id: todo.id.toString(),
//         title: todo.title,
//         description: todo.description,
//         completed: todo.completed.toString(),
//       }).toString();

//       router.push(`/edittodo?${queryParams}`);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}todo/deletetodo/${id}/`);
//       setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
//       setFiltertodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
//       toast.success('Todo deleted successfully');
//     } catch (error) {
//       console.error('Error deleting todo:', error);
//       toast.error('Failed to delete todo');
//     }
//   };

//   const handleCreateTodos = () => {
//     router.push('/createtodo');
//   };

//   const handleFiltertodos = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (value) {
//       const filteredTodos = todos.filter((todo) =>
//         todo.title.toLowerCase().includes(value.toLowerCase())
//       );
//       setFiltertodos(filteredTodos);
//     } else {
//       setFiltertodos(todos);
//     }
//   };

//   const indexOfLastTodo = currentpage * itemsPerPage;
//   const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
//   const currentTodos = filtertodos.slice(indexOfFirstTodo, indexOfLastTodo);

//   async function handleAddToGoogleCalendar(todo: Todo) {
//     if (!startDate || !endDate) {
//       toast.error('Please select both start and end date and time.');
//       return;
//     }

//     const eventSummary = todo.title; // Use todo title as the summary
//     const eventDescription = todo.description; // Use todo description
//     const eventLocation = 'Remote'; // Default location

//     try {
//       const response = await fetch('/api/addtogooglecalendar', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           summary: eventSummary,
//           location: eventLocation,
//           description: eventDescription,
//           start: startDate,
//           end: endDate,
//           // attendees: [
//           //   { email: 'kaustubhr2001@gmail.com' },
//           //   { email: 'kaustubh.raut@fxis.ai' },
//           // ],
//         }),
//       });

//       const data = await response.json();
//       if (data.message === 'Event created') {
//         toast.success('Event added to Google Calendar successfully!');
//       } else {
//         toast.error('Error creating event in Google Calendar');
//       }
//     } catch (error) {
//       console.error('Error creating event:', error);
//       toast.error('Failed to create event in Google Calendar');
//     }
//   }

//   const paginate = (pageNumber: number) => setCurrentpage(pageNumber);

//   return (
//     <div>
//       <ToastContainer />
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
//           <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={handleCreateTodos}>
//             Create Todo
//           </button>
//         </div>
//         <input
//           onChange={(e) => handleFiltertodos(e)}
//           placeholder="Filter todos"
//           className="border border-gray-800 rounded py-2 px-4 w-full mb-4"
//         />
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 text-left">Title</th>
//               <th className="px-4 py-2 text-left">Status</th>
              
//               <th className="px-4 py-2 text-left">Start Date Time</th>
//               <th className="px-4 py-2 text-left">End Date Time</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//               <th className="px-4 py-2 text-left">Add to Calendar</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentTodos.length > 0 &&
//               currentTodos.map((todo) => (
//                 <tr key={todo.id} className="border-b">
//                   <td className="px-4 py-2">{todo.title}</td>
//                   <td className="px-4 py-2">{todo.completed ? 'Completed' : 'Not Completed'}</td>
                 
//                   <td className="px-4 py-2">
//                     <input type="datetime-local" onChange={(e) => setStartDate(e.target.value)} />
//                   </td>
//                   <td className="px-4 py-2">
//                     <input type="datetime-local" onChange={(e) => setEndDate(e.target.value)} />
//                   </td>
//                   <td className=" flex justify-center  items-center px-4 py-2 space-x-2">
//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                       onClick={() => handleEdit(todo.id)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                       onClick={() => handleDelete(todo.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => handleAddToGoogleCalendar(todo)} // Pass the current todo
//                       className="w-full bg-blue-500 text-white text-sm p-2 m-2 rounded hover:bg-blue-600 transition duration-200"
//                     >
//                       Add to Google Calendar
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//         {/* Pagination Component */}
//         <div className="flex justify-center mt-4">
//           {Array.from({ length: Math.ceil(filtertodos.length / itemsPerPage) }, (_, index) => (
//             <button
//               key={index}
//               onClick={() => paginate(index + 1)}
//               className={`mx-1 px-3 py-1 rounded ${index + 1 === currentpage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;













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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtertodos, setFiltertodos] = useState<Todo[]>(todos);
  const [currentpage, setCurrentpage] = useState(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { data: Session } = useSession();
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}todo/getalltodosbyuseremail/${Session?.user?.email}/`
        );
        setTodos(response.data);
        setFiltertodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [Session?.user?.email]);

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
    if (!startDate || !endDate) {
      toast.error('Please select both start and end date and time.');
      return;
    }

    const eventSummary = todo.title; 
    const eventDescription = todo.description; 
    const eventLocation = 'Remote'; 

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
          start: startDate,
          end: endDate,
          // attendees: [
          //   { email: 'kaustubhr2001@gmail.com' },
          //   { email: 'kaustubh.raut@fxis.ai' },
            
          // ]
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
    }
  }

  const createCalendarEvent = async (eventDetails: any) => {
    try {
      const response = await fetch('/api/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Event created:', data);
        toast.success('Event created successfully!');
      } else {
        console.error('Error creating event:', data.message);
        toast.error('Error creating event: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create event');
    }
  };

  // const handleTestCreateEvent = () => {
  //   const eventDetails = {
  //     summary: 'Team Meeting',
  //     location: 'Zoom',
  //     description: 'Discuss project updates',
  //     start: '2024-10-10T10:00:00+05:30',
  //     end: '2024-10-10T11:00:00+05:30',
  //   };

  //   createCalendarEvent(eventDetails);
  // };

  const paginate = (pageNumber: number) => setCurrentpage(pageNumber);

  return (
    <div>
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4">Todos Dashboard</h1>
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={handleCreateTodos}>
            Create Todo
          </button>
        </div>
        <input
          onChange={(e) => handleFiltertodos(e)}
          placeholder="Filter todos"
          className="border border-gray-800 rounded py-2 px-4 w-full mb-4"
        />
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Start Date Time</th>
              <th className="px-4 py-2 text-left">End Date Time</th>
              <th className="px-4 py-2 text-left">Actions</th>
              <th className="px-4 py-2 text-left">Add to Calendar</th>
            </tr>
          </thead>
          <tbody>
            {currentTodos.length > 0 &&
              currentTodos.map((todo) => (
                <tr key={todo.id} className="border-b">
                  <td className="px-4 py-2">{todo.title}</td>
                  <td className="px-4 py-2">{todo.completed ? 'Completed' : 'Not Completed'}</td>
                  <td className="px-4 py-2">
                    <input type="datetime-local" onChange={(e) => setStartDate(e.target.value)} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="datetime-local" onChange={(e) => setEndDate(e.target.value)} />
                  </td>
                  <td className="flex justify-center items-center px-4 py-2 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(todo.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAddToGoogleCalendar(todo)} 
                      className="w-full bg-blue-500 text-white text-sm p-2 m-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Add to Google Calendar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        
        {/* <div className="flex justify-center mt-4">
          <button
            onClick={handleTestCreateEvent}
            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
          >
            Test Create Calendar Event
          </button>
        </div> */}
       
        <div className="flex justify-center mt-4">
          <button
            onClick={() => currentpage > 1 && setCurrentpage(currentpage - 1)}
            className="px-4 py-2 border bg-white text-blue-500"
          >Previous</button>
          {Array.from({ length: Math.ceil(filtertodos.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 border ${
                currentpage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => currentpage < Math.ceil(filtertodos.length / itemsPerPage) && setCurrentpage(currentpage + 1)}
            className="px-4 py-2 border bg-white text-blue-500"
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
