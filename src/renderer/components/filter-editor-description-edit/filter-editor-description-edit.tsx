import React from 'react';
import { Filter } from '../../types/types';

interface FilterEditorDescriptionEditProps {
  filter: Filter;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

const FilterEditorDescriptionEdit: React.FC<FilterEditorDescriptionEditProps> = ({
  filter,
  onSave,
  onCancel,
}) => {
  const [editedName, setEditedName] = React.useState(filter.name);
  const [editedDescription, setEditedDescription] = React.useState(filter.description || '');

  const handleSave = () => {
    onSave(editedName, editedDescription);
  };

  return (
    <>
      <div className="fixed inset-0 bg-onyx-transparent z-50" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-onyx-500 p-5 max-w-4xl mx-auto shadow-lg z-50 w-96">
        <h1 className="text-center py-1 mb-5 text-2xl tracking-wider">
          Edit Filter
        </h1>
        <div className="mb-5">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">NAME:</p>
            <input
              id="filter-name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Enter filter name..."
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">DESCRIPTION:</p>
            <textarea
              id="filter-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter filter description..."
              className="w-full"
            />
          </div>
          <div className="flex gap-5 items-center justify-end">
            <button 
              onClick={onCancel} 
              className="button-error tracking-wider w-full flex items-center justify-center gap-2 min-h-10"
            >
              CANCEL
            </button>
            <button 
              onClick={handleSave} 
              className="button-primary tracking-wider w-full flex items-center justify-center gap-2 min-h-10"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterEditorDescriptionEdit; 