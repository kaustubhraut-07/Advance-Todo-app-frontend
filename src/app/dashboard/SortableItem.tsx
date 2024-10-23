'use client'
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import EditTodo from '../edittodo/page';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

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
  // const { attributes, listeners, setNodeRef } = useDraggable({ id: todo.id.toString() });
  const { attributes, listeners, setNodeRef , transform , transition } = useSortable({ id: todo.id.toString() });
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Get the dark mode state from Redux
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-4 mb-2 rounded shadow ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{todo.title}</h3>
          <p>{todo.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 rounded ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400'
            } text-white`}
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            className={`px-2 py-1 rounded ${
              isDarkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'
            } text-white`}
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Render EditTodo Modal */}
      {isEditModalOpen && (
        <EditTodo
          todo={todo}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SortableTodoItem;
