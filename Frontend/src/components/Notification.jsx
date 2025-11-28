import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const Notification = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 bg-opacity-90 border-green-600';
      case 'error':
        return 'bg-red-900 bg-opacity-90 border-red-600';
      case 'warning':
        return 'bg-yellow-900 bg-opacity-90 border-yellow-600';
      default:
        return 'bg-blue-900 bg-opacity-90 border-blue-600';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBgColor()} border rounded-lg p-4 shadow-lg backdrop-blur-md`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-white text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;