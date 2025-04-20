import React, { useEffect } from "react";
import { requestPermission } from "../services/firebase";

const NotificationPage = () => {
  useEffect(() => {
    requestPermission().then(token => {
      if (token) {
        console.log("Token đã nhận:", token);
      }
    });
  }, []);

  return (
    <div>
      <h1>Trang thông báo</h1>
      <p>Thông báo của bạn sẽ hiển thị ở đây.</p>
    </div>
  );
};

export default NotificationPage;
