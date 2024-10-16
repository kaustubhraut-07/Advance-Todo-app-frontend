import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface SortableTodoItemProps {
  todo: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SortableTodoItem: React.FC<SortableTodoItemProps> = ({ todo, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: todo.id.toString() });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="p-4 mb-2 bg-gray-100 rounded shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{todo.title}</h3>
          <p>{todo.description}</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => onEdit(todo.id)}>Edit</button>
          <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default SortableTodoItem;
