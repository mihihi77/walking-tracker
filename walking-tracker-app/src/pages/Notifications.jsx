import React, { useEffect } from 'react';
import { requestForToken, onMessageListener } from '../firebase';

const Notifications = () => {
  useEffect(() => {
    requestForToken(() => {}); // Lấy token FCM

    onMessageListener()
      .then(payload => {
        const newNotification = {
          title: payload.notification.title,
          body: payload.notification.body,
          time: new Date().toLocaleString(),
        };

        // Lưu thông báo vào localStorage
        const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
        stored.unshift(newNotification); // Thêm thông báo mới vào đầu
        localStorage.setItem('notifications', JSON.stringify(stored));

        // Nếu muốn có popup nhẹ: console.log hoặc toast ở đây
        console.log(`Notification received: ${newNotification.title}`);
      })
      .catch(err => console.log('failed to receive notification: ', err));
  }, []);

  return null; // Component không cần render gì
};



export default Notifications;
