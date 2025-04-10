import React, { useState } from 'react';
import { RuleColor } from '../../types/types';
import { IoClose } from 'react-icons/io5';
import { ColorHelper } from '../../utils/color-helper';
import './filter-editor-rule-edit-color-picker.scss';

interface ColorPickerProps {
  value: RuleColor;
  onChange: (color: RuleColor) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getColorName = (color: RuleColor): string => {
    return RuleColor[color] || 'Select Color';
  };

  const handleColorSelect = (color: RuleColor) => {
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
          className={`w-4 h-4 border ${ColorHelper.getBackgroundColorClassName(value)} ${ColorHelper.getBorderColorClassName(value)} ${ColorHelper.getTextColorClassName(value)}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-onyx-transparent z-50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-primary to-onyx-500 p-5 shadow-lg z-50 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl w-full text-center">Select Color</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:text-black-600"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex justify-center items-center mb-4">            
              <strong className="text-sm text-center">Click on a color to select it.</strong>
            </div>

            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-center">Outline Colors</h3>
                  <div className="flex flex-col gap-2">
                    {Object.entries(RuleColor)
                      .filter(([name]) => !name.includes('Solid') && isNaN(Number(name)))
                      .map(([name, colorValue]) => (
                        <div
                          key={name}
                          onClick={() => handleColorSelect(colorValue as RuleColor)}
                          className={`flex items-center p-2 cursor-pointer border backdrop-filter ${ColorHelper.getBackgroundColorClassName(colorValue as RuleColor)} ${ColorHelper.getTextColorClassName(colorValue as RuleColor)} ${ColorHelper.getBorderColorClassName(colorValue as RuleColor)}`}
                        >
                          <span className="font-medium text-center w-full">Label Example</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-center">Solid Colors</h3>
                  <div className="flex flex-col gap-2">
                    {Object.entries(RuleColor)
                      .filter(([name]) => name.includes('Solid') && isNaN(Number(name)))
                      .map(([name, colorValue]) => (
                        <div
                          key={name}
                          onClick={() => handleColorSelect(colorValue as RuleColor)}
                          className={`flex items-center p-2 cursor-pointer border ${ColorHelper.getBackgroundColorClassName(colorValue as RuleColor)} ${ColorHelper.getTextColorClassName(colorValue as RuleColor)} ${ColorHelper.getBorderColorClassName(colorValue as RuleColor)}`}
                        >
                          <span className="font-medium text-center w-full">Label Example</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker; 