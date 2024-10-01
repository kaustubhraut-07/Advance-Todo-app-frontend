'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Todo {
  id: number; // Replace with the actual ID type if different
  title: string;
  description: string;
  completed: boolean;
}

interface EditTodoProps {
  todo: Todo; // Pass the todo item to edit as a prop
  onUpdate: (updatedTodo: Todo) => void; // Callback function to handle the update
}

const EditTodo: React.FC<EditTodoProps> = ({ todo, onUpdate }) => {
//   const { data: session } = useSession();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [completed, setCompleted] = useState(todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTodo = { ...todo, title, description, completed };
    onUpdate(updatedTodo); // Call the onUpdate callback with the updated todo
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-5">Edit Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
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
          <label className="text-gray-700" htmlFor="completed">
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
        </div>
      </form>
      {session?.user && (
        <div className="mt-4 text-center">
          <p>Editing as: {session.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default EditTodo;
