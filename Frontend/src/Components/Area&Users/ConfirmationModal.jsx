import React from "react";

const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-3/4 max-w-md">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 mr-2">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600" >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
