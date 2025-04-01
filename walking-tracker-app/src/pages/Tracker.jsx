import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const Tracker = ({ user }) => {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const distance = position.coords.speed || 0; 
          setSteps((prev) => prev + Math.round(distance * 1.3));
        },
        (error) => console.error("Lỗi GPS:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    setCalories(steps * 0.04);
  }, [steps]);

  const saveData = async () => {
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      await setDoc(doc(db, "users", user.uid, "tracking", today), {
        steps,
        calories,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Theo dõi hoạt động</h2>
      <p>Bước chân: {steps}</p>
      <p>Calo tiêu hao: {calories.toFixed(2)} kcal</p>
      <button onClick={saveData} className="mt-2 p-2 bg-green-500 text-white rounded">
        Lưu dữ liệu
      </button>
    </div>
  );
};

export default Tracker;
