// NotificationContext.js
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    // Listen for notification events
    socket.on('notification', (notif) => {
      console.log('Received notification:', notif);
      
      setUnreadNotificationsCount((prevCount) => prevCount + 1);
    });

    return () => {
      // Clean up the event listener on component unmount
      socket.off('notification');
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadNotificationsCount, setUnreadNotificationsCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
