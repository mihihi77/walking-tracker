import React, { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../firebase';

const Notifications = ({ onNewNotification }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Lấy danh sách thông báo từ localStorage khi component load
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(storedNotifications);
    
    requestForToken(() => {});

    onMessageListener()
      .then(payload => {
        const newNotification = {
          title: payload.notification.title,
          body: payload.notification.body,
          time: new Date().toLocaleString(),
        };

        // Lưu thông báo mới vào localStorage
        const updatedNotifications = [newNotification, ...storedNotifications];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

        // Cập nhật state notifications và gọi callback
        setNotifications(updatedNotifications);

        // Nếu cần callback cho logic khác, có thể gọi:
        if (onNewNotification) onNewNotification(newNotification);
      })
      .catch(err => console.log('failed to receive notification: ', err));
  }, [notifications, onNewNotification]);

  return null; // Không cần render gì
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(stored);
  }, []);

  return (
    <div style={{ position: 'absolute', top: '60px', right: '20px', background: '#222', color: '#fff', padding: '1rem', borderRadius: '8px', width: '300px' }}>
      <h4>Recent Notifications</h4>
      {notifications.length === 0 ? (
        <p>No activities yet. Start your first attempt! 🏃‍♂️</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={{ borderBottom: '1px solid #444', padding: '0.5rem 0' }}>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
            <small>{n.time}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
