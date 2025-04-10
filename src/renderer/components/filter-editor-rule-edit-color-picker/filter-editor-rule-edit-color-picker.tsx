import React, { useState } from 'react';
import { RuleColor } from '../../types/types';
import { IoClose } from 'react-icons/io5';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getColorName = (color: string): string => {
    return Object.entries(RuleColor).find(([_, value]) => value === color)?.[0] || 'Select Color';
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-onyx-400 text-white border border-onyx-300 p-2 rounded flex items-center justify-between"
      >
        <span>{getColorName(value)}</span>
        <div
          className="w-4 h-4 rounded border border-onyx-300"
          style={{ backgroundColor: value }}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-onyx-transparent z-50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-onyx-500 p-5 shadow-lg z-50 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Select Color</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {Object.entries(RuleColor).map(([name, colorValue]) => (
                <div
                  key={name}
                  onClick={() => handleColorSelect(colorValue)}
                  className="flex items-center p-2 hover:bg-onyx-400 rounded cursor-pointer"
                  style={{ backgroundColor: colorValue }}
                >
                  <span className="text-black font-medium">Label Example</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker; 