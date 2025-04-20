import React, { useState, useEffect } from "react";

const Login = () => {
  const [formType, setFormType] = useState("login"); 
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "url('https://i.pinimg.com/736x/b5/21/d6/b521d6b4243c22fc094222675e4ba811.jpg') no-repeat center center",
      backgroundSize: "cover",
    },
    wrapper: {
      background: "rgba(255, 255, 255, 0.3)",
      padding: "30px",
      borderRadius: "60px",
      backdropFilter: "blur(100px)",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      width: "350px",
    },
    heading: {
      fontSize: "40px",
      fontWeight: "bold",
      background: "linear-gradient(45deg, #28a745, #1e7e34)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "4px 4px 6px rgba(0, 0, 0, 0.3)",
      marginBottom: "20px",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      background: "white",
      borderRadius: "29px",
      padding: "1px 15px",
      marginBottom: "15px",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    },
    icon: {
      fontSize: "20px",
      marginRight: "10px",
      color: "#218838",
      cursor: "pointer",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "16px",
      padding: "10px",
      background: "transparent",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      transition: "transform 0.3s ease, background 0.3s ease",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
    link: {
      color: "#000",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>
          {formType === "login" ? "Login" : "Sign Up"}
        </h1>

        {formType === "signup" && (
          <div style={styles.inputContainer}>
            <i className="fas fa-user" style={styles.icon}></i>
            <input type="text" placeholder="Full Name" style={styles.input} />
          </div>
        )}

        <div style={styles.inputContainer}>
          <i className="fas fa-envelope" style={styles.icon}></i>
          <input type="email" placeholder="Email" style={styles.input} />
        </div>

        {(formType === "login" || formType === "signup") && (
          <div style={styles.inputContainer}>
            <i className="fas fa-lock" style={styles.icon}></i>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              style={styles.input}
            />
            <i
              className={passwordVisible ? "fas fa-eye" : "fas fa-eye-slash"}
              style={styles.icon}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        )}

        <button style={styles.button}>
          {formType === "login" ? "Login" : "Sign Up"}
        </button>

        {formType === "login" && (
          <>
            <p style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)", marginTop: "10px" }}>
              Don't have an account?{" "}
              <span
                style={{ fontWeight: "bold", cursor: "pointer", color: "#000" }}
                onClick={() => setFormType("signup")}
              >
                Sign Up
              </span>
            </p>
          </>
        )}

        {formType === "signup" && (
          <p style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)", marginTop: "10px" }}>
            Already have an account?{" "}
            <span
              style={{ fontWeight: "bold", cursor: "pointer", color: "#000" }}
              onClick={() => setFormType("login")}
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
