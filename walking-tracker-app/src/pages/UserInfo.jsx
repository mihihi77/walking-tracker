// src/pages/UserInfoForm.jsx
import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name,
        height,
        weight,
        createdAt: new Date(),
      });
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} required />
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      <button type="submit">Save</button>
    </form>
  );
};

export default UserInfoForm;
