import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Profile:", { name, gender, age, weight, height });
    alert("Profile saved successfully!");
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={headingStyle}>Profile Information</h2>
        
        <label style={labelStyle}>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        
        <label style={labelStyle}>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required style={inputStyle}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <label style={labelStyle}>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} />
        
        <label style={labelStyle}>Weight (kg):</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required style={inputStyle} />
        
        <label style={labelStyle}>Height (cm):</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required style={inputStyle} />
        
        <button type="submit" style={buttonStyle}>Save</button>
      </form>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "url('https://i.pinimg.com/736x/fc/c3/62/fcc3623a89499c004a9e6701b0677c79.jpg') no-repeat center center",
  backgroundSize: "100% 100%"  

};

const formStyle = {
  background: "rgba(255, 255, 255, 0.6)", 
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  width: "320px",
  fontFamily: "Courier New",
  paddingTop: "20px",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "22px",
  fontWeight: "600",
};

const labelStyle = {
  fontSize: "15px",
  fontWeight: "500",
  marginBottom: "5px",
  display: "block",
  
};

const inputStyle = {
  width: "90%",
  padding: "10px",
  margin: "6px 0 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  fontFamily: "Courier New",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "700",
  transition: "0.3s",
  fontFamily: "Courier New",
};

export default Profile;