import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    securityKey: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/signup", formData)
      .then((response) => {
        if (response.data.status) {
          navigate("/login");
        } else {
          setError(response.data.message); // Set error message if status is false
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Invalid security key. Please try again.");
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message */}
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="*******"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="securityKey">Security Key:</label>
        <input
          id="securityKey"
          name="securityKey"
          type="password"
          placeholder="Security Key"
          value={formData.securityKey}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Have an Account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
