// src/hooks/useNotifications.js
import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Notification = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users", userId, "notifications"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [userId]);

  return notifications;
};

export default Notification;

  