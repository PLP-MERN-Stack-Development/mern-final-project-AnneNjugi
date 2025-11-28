import React, { createContext, useContext, useState } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration) => addNotification('success', message, duration);
  const showError = (message, duration) => addNotification('error', message, duration);
  const showWarning = (message, duration) => addNotification('warning', message, duration);
  const showInfo = (message, duration) => addNotification('info', message, duration);

  return (
    <NotificationContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};