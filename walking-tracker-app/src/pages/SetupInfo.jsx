// SetupInfo.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Setup = ({ onSetupComplete }) => { // Nhận callback
  const [setupInfo, setSetupInfo] = useState({
    name: '',
    height: '',
    weight: '',
    activityLevel: 'low',
    goalSteps: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetupInfo({ ...setupInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userData = {
      displayName: setupInfo.name,
      height: parseFloat(setupInfo.height),
      weight: parseFloat(setupInfo.weight),
      activityLevel: setupInfo.activityLevel,
      goalSteps: parseInt(setupInfo.goalSteps),
      dailyCalories: calculateCalories(parseFloat(setupInfo.weight), setupInfo.activityLevel),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      localStorage.setItem('userInfo', JSON.stringify(userData));
      onSetupComplete(user); // Gọi callback ở đây, truyền user
      navigate('/about');
    } catch (error) {
      console.error('Error saving setup data:', error);
    }
  };

  const calculateCalories = (weight, activity) => {
    const baseCalories = weight * 22;
    return activity === 'high' ? baseCalories * 1.5 : activity === 'medium' ? baseCalories * 1.3 : baseCalories * 1.1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="bg-[#121212] shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-white-800 mb-6">Setup Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-white-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={setupInfo.name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-white-700 text-sm font-bold mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={setupInfo.height}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-white-700 text-sm font-bold mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={setupInfo.weight}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="activityLevel" className="block text-white-700 text-sm font-bold mb-2">
              Activity Level
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={setupInfo.activityLevel}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label htmlFor="goalSteps" className="block text-white-700 text-sm font-bold mb-2">
              Goal Steps/Day
            </label>
            <input
              type="number"
              id="goalSteps"
              name="goalSteps"
              value={setupInfo.goalSteps}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-[#12a245] hover:bg-[#15d85a] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;