import React, { useEffect } from 'react';
import {
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
  IoMdAlert,
} from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const alertTypes = {
  success: {
    icon: <IoMdCheckmarkCircle className="text-green-600 text-2xl" />,
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-800",
  },
  error: {
    icon: <IoMdCloseCircle className="text-red-600 text-2xl" />,
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-800",
  },
  warning: {
    icon: <IoMdAlert className="text-yellow-600 text-2xl" />,
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-800",
  },
 };

  const AlertBox = ({ type = "", message = "", onClose, duration = 2000 }) => {
  const { icon, bg, border, text } = alertTypes[type] || alertTypes.success;

  useEffect( () => {
    if (duration && onClose) {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`flex items-start p-4 border-l-4 rounded-md shadow-md ${bg} ${border} min-w[200px]`}>
        <div className="mr-3">{icon}</div>
        <div className={`flex-grow ${text} text-sm`}>{message}</div>
        {onClose && (
            <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700 font-bold ml-3">
            <RxCross2 />
            </button>
        )}
    </div>
  );
};

export default AlertBox;