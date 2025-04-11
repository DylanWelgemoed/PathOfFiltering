import React, { useRef } from 'react';
import { IoClose } from 'react-icons/io5';

interface FilterSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  onCloseMainOverlay: () => void;
}

export default function FilterSuccessDialog({ open, onClose, onCloseMainOverlay }: FilterSuccessDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    onClose();
    onCloseMainOverlay();
  };

  return (
    <>
      <div className="fixed inset-0 bg-onyx-transparent z-50" onClick={handleClose} />
      <div 
        ref={dialogRef}
        className="filter-success-dialog fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-onyx-500 p-5 shadow-lg z-50 w-96"
        onClick={handleDialogClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl w-full text-center">Successfully Saved</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-center">
            The filter has been successfully saved. Please go to your in-game options and either refresh your current filter or select the new filter if you haven't already.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="button-primary tracking-wider w-full flex items-center justify-center gap-2 min-h-10"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
} 