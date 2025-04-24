import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const useUserStats = (userId) => {
  const [stats, setStats] = useState({
    calories: 0,
    steps: 0, // Giờ có thể dùng distance thay steps nếu cần
    activeDays: 0,
    distance: 0, // thêm nếu muốn
  });

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "users", userId, "activities"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let totalCalories = 0;
      let totalDistance = 0;
      let todayCalories = 0;
      let todayDistance = 0;
      let daysSet = new Set();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.() || new Date();
        const isToday = new Date().toDateString() === date.toDateString();
      
        if (date >= oneWeekAgo) {
          totalCalories += data.calories;
          totalDistance += data.distance;
          daysSet.add(date.toDateString());
        }
      
        if (isToday) {
          todayCalories += data.calories;
          todayDistance += data.distance;
        }
      });

      setStats({
        calories: Math.floor(totalCalories), // Bỏ phần thập phân
        steps: Math.floor(totalDistance * 1312), // 1km ≈ 1312 bước
        activeDays: daysSet.size,
        distance: totalDistance.toFixed(2), // Nếu muốn hiện km
        todayCalories: Math.floor(todayCalories),
        todayDistance: todayDistance.toFixed(2),
      });
    });

    return () => unsubscribe();
  }, [userId]);

  return stats;
};

export default useUserStats;
