import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const [lootFilterPath, setLootFilterPath] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-loot-filter-dir');
      if (result.success) {
        setLootFilterPath(result.path);
      }
    };

    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const handleSave = async () => {
    const result = await window.electron.ipcRenderer.invoke('set-loot-filter-dir', lootFilterPath);
    if (result.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-onyx-transparent flex items-center justify-center">
      <div className="bg-onyx-500 p-6 rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Loot Filter Folder Path
            </label>
            <input
              type="text"
              value={lootFilterPath}
              onChange={(e) => setLootFilterPath(e.target.value)}
              className="w-full p-2 bg-onyx-400 border border-onyx-300 rounded"
              placeholder="Enter path to loot filter folder"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="button-secondary px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="button-primary px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog; 