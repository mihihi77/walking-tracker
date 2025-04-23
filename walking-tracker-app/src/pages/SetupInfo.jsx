import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Setup = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("low");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userData = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
      dailyCalories: calculateCalories(weight, activityLevel),
      dailySteps: calculateSteps(activityLevel)
    };

    try {
      await setDoc(doc(db, "users", user.uid), userData, { merge: true });
      navigate("/dashboard?tab=stats");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const calculateCalories = (weight, activity) => {
    const baseCalories = weight * 22;
    return activity === "high" ? baseCalories * 1.5 : activity === "medium" ? baseCalories * 1.3 : baseCalories * 1.1;
  };

  const calculateSteps = (activity) => {
    return activity === "high" ? 12000 : activity === "medium" ? 8000 : 5000;
  };

  return (
    <div>
      <h1>Setup Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <p>What is your height?</p>
        <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} required />
        <p>We also need your weight <br /> Your data will be kept private!</p>
        <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        <p>How active are you?</p>
        <p>Low: Little to no exercise</p>
        <p>Medium: Exercise 1-3 times a week</p>
        <p>High: Exercise more than 3 times a week</p>
        <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Save and Continue</button>
      </form>
    </div>
  );
};

export default Setup;