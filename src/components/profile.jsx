import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const redirectToLogin = () => navigate('/login');

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err.message);
      alert('Failed to load user data.');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('token');
      redirectToLogin();
    } catch (err) {
      console.error('Logout error:', err.message);
      alert('Failed to logout.');
    }
  };

  const removeProfilePhoto = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      await axios.delete('http://localhost:5000/api/users/profile-photo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, profilePhoto: null }));
      alert('Profile photo removed successfully.');
    } catch (err) {
      console.error('Remove photo error:', err.message);
      alert('Failed to remove photo.');
    }
  };

  const uploadNewPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const res = await axios.put('http://localhost:5000/api/users/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((prev) => ({ ...prev, profilePhoto: res.data.profilePhoto }));
      alert('Profile photo uploaded successfully.');
    } catch (err) {
      console.error('Upload photo error:', err.message);
      alert('Failed to upload photo.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!user) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;

  const profilePhotoSrc = user.profilePhoto
    ? `http://localhost:5000/${user.profilePhoto.replace(/\\/g, '/')}`
    : 'http://localhost:5000/default-profile-photo.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <header className="bg-blue-500 text-white shadow-md font-bold">
        <nav className="flex justify-between items-center px-6 py-4">
          <ul className="flex space-x-6 items-center text-sm md:text-base">
            <li>
              <a href="/dashboard" className="flex items-center gap-2 hover:underline">
                
                Dashboard
              </a>
            </li>
            <li>
              <a href="/upload" className="flex items-center gap-2 hover:underline">
                
                Upload Photos
              </a>
            </li>
            <li>
              <a href="/view" className="flex items-center gap-2 hover:underline">
                
                View Your Photos
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2  hover:underline"
              >
                
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <img
              src={profilePhotoSrc}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-blue-400 shadow-md"
            />
            <div className="mt-4 flex flex-col gap-3 w-full">
              <button
                onClick={removeProfilePhoto}
                className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Remove Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={uploadNewPhoto}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Upload New Photo
              </button>
            </div>
          </div>

          <div className="text-left w-full bg-gray-50 rounded-lg p-6 shadow-inner">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
              {user.name}
            </h1>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Course:</span> {user.course}</p>
            <p className="text-gray-700"><span className="font-semibold">College Year:</span> {user.collegeYear}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
