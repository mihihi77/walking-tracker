// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    height: '',
    weight: '',
    activityLevel: 'low',
    goalSteps: '',
  });
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async (e) => {
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
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setIsEditing(false); // Chuyển về chế độ xem sau khi lưu
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const calculateCalories = (weight, activity) => {
    const baseCalories = weight * 22;
    return activity === 'high' ? baseCalories * 1.5 : activity === 'medium' ? baseCalories * 1.3 : baseCalories * 1.1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="bg-[#121212] shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-white-800 mb-6">Your Profile</h2>

        {isEditing ? (
          <form onSubmit={handleSaveClick} className="space-y-4">
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
                Goal Distance/Day (km)
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
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#12a245] hover:bg-[#15d85a] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-white-700"><span className="font-bold">Name:</span> {profileInfo.name}</p>
            </div>
            <div>
              <p className="text-white-700"><span className="font-bold">Height:</span> {profileInfo.height} cm</p>
            </div>
            <div>
              <p className="text-white-700"><span className="font-bold">Weight:</span> {profileInfo.weight} kg</p>
            </div>
            <div>
              <p className="text-white-700"><span className="font-bold">Activity Level:</span> {profileInfo.activityLevel}</p>
            </div>
            <div>
              <p className="text-white-700"><span className="font-bold">Goal Distance/Day (km):</span> {profileInfo.goalSteps}</p>
            </div>
            <button
              onClick={handleEditClick}
              className="bg-[#12a245] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;