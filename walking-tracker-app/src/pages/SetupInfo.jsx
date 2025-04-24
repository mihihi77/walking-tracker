import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Setup = ({ onSetupComplete }) => {
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    height: '',
    weight: '',
    activityLevel: 'low',
    goalSteps: '',
  });
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileInfo({
            name: userData.displayName || '',
            height: userData.height || '',
            weight: userData.weight || '',
            activityLevel: userData.activityLevel || 'low',
            goalSteps: userData.goalSteps || '',
          });
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const userData = {
      displayName: profileInfo.name,
      height: parseFloat(profileInfo.height),
      weight: parseFloat(profileInfo.weight),
      activityLevel: profileInfo.activityLevel,
      goalSteps: parseInt(profileInfo.goalSteps),
      dailyCalories: calculateCalories(parseFloat(profileInfo.weight), profileInfo.activityLevel),
    };

    try {
      console.log("SetupInfo.js: handleSubmit started");
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      console.log("SetupInfo.js: Data saved to Firestore");
      localStorage.setItem('userInfo', JSON.stringify(userData));
      console.log("SetupInfo.js: userInfo saved to localStorage");
      if (onSetupComplete) {
        console.log("SetupInfo.js: Calling onSetupComplete with user:", user?.uid);
        onSetupComplete(user);
        console.log("SetupInfo.js: onSetupComplete called");
      }
      navigate('/about');
      console.log("SetupInfo.js: Navigated to /about");
    } catch (error) {
      console.error('SetupInfo.js: Error updating profile data:', error);
    }
  };

  const calculateCalories = (weight, activity) => {
    const baseCalories = weight * 22;
    return activity === 'high' ? baseCalories * 1.5 : activity === 'medium' ? baseCalories * 1.3 : baseCalories * 1.1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="bg-[#121212] shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-white-800 mb-6">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-white-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileInfo.name}
              onChange={handleChange}
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
              value={profileInfo.height}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
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
              value={profileInfo.weight}
              onChange={handleChange}
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
              value={profileInfo.activityLevel}
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
              value={profileInfo.goalSteps}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-[#12a245] hover:bg-[#15d85a] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;