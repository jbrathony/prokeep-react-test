import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isEmailValid = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid(formData.email)) {
      setError('Invalid email address');
      return;
    }

    // Send a POST request to https://reqres.in
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email: formData.email,
        password: formData.password,
      });

      // Handle the response here (e.g., authentication success)
      console.log('Login successful:', response.data);

      // Clear the form and error message
      setFormData({ email: '', password: '' });
      setError(null);
    } catch (error) {
      // Handle errors (e.g., authentication failure)
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label for="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginForm;
