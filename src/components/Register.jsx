// src/components/Register.jsx
import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [collegeYear, setCollegeYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  

    const formData = new FormData();
    formData.append('name', name);
    formData.append('course', course);
    formData.append('collegeYear', collegeYear);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

// https://college-even-backend-2.onrender.com

    try {
      await axios.post('https://college-even-backend-2.onrender.com/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label htmlFor="registerName" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="registerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="registerCourse" className="block text-sm font-medium text-gray-700">Course:</label>
            <input
              type="text"
              id="registerCourse"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="registerCollegeYear" className="block text-sm font-medium text-gray-700">College Year:</label>
            <input
              type="text"
              id="registerCollegeYear"
              value={collegeYear}
              onChange={(e) => setCollegeYear(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="registerEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="registerPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="registerProfilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo:</label>
            <input
              type="file"
              id="registerProfilePhoto"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
