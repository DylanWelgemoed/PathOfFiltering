import React, { useState, useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedLabels = value.map(v => options.find(o => o.value === v)?.label).filter(Boolean);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div
        className="w-full bg-onyx-400 text-white border border-onyx-300 p-2 cursor-pointer min-h-[40px] flex flex-wrap gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map(label => (
            <span
              key={label}
              className="bg-onyx-500 px-2 flex items-center gap-1"
            >
              {label}
              <button
                onClick={(e) => removeOption(options.find(o => o.label === label)?.value || '', e)}
                className="hover:text-error"
              >
                <IoClose size={16} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-white">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-onyx-500 border border-onyx-300 shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full bg-onyx-400 text-white border border-onyx-300 p-2"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={`p-2 cursor-pointer hover:bg-onyx-400 flex items-center gap-2 ${
                  value.includes(option.value) ? 'bg-onyx-400' : ''
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  readOnly
                  className="w-4 h-4 text-blue-600 bg-onyx-400 border-onyx-300 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 