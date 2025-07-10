import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobno: '',
    password: '',
    confirmpassword: '',
    showPassword: false,
  });
  const Navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formType === 'signup' &&
      formData.password !== formData.confirmpassword
    ) {
      return alert('Passwords do not match');
    }

    const url = `http://localhost:5000/auth/${formType}`;
    const { name, email, mobno, password } = formData;
    const payload =
      formType === 'signup'
        ? { name, email, mobno, password }
        : { email, password };

    try {
      const res = await axios.post(url, payload);
      if (formType === 'login') {
        localStorage.setItem('token', res.data.token);
        alert('Login successful');
        Navigate('/'); // Redirect to home page
        window.location.reload(); // Reload to reset state
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // redirect or update UI here
      } else {
        alert('Signup successful, please login.');
        setFormType('login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border shadow rounded">
      <h2 className="text-2xl mb-4 text-center">
        {formType === 'login' ? 'Login' : 'Signup'}
      </h2>
      <form onSubmit={handleSubmit}>
        {formType === 'signup' && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="mobno"
              placeholder="Mobile Number"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type={formData.showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {formType === 'signup' && (
          <>
            <input
              type={formData.showPassword ? 'text' : 'password'}
              name="confirmpassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-sm text-blue-500 mb-3"
            >
              {formData.showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </button>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {formType === 'login' ? 'Login' : 'Signup'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        {formType === 'login'
          ? "Don't have an account?"
          : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() =>
            setFormType((prev) => (prev === 'login' ? 'signup' : 'login'))
          }
          className="text-blue-500 underline"
        >
          {formType === 'login' ? 'Signup' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default Login;