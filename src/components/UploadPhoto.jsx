import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://college-even-backend-2.onrender.com/default-profile-photo.jpg');
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const response = await axios.get('https://college-even-backend-2.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;
      const profilePhotoSrc = user.profilePhoto
        ? `https://college-even-backend-2.onrender.com/${user.profilePhoto.replace(/\\/g, '/')}`
        : 'https://college-even-backend-2.onrender.com/default-profile-photo.jpg';
      setProfilePhoto(profilePhotoSrc);
    } catch (err) {
      console.error('Error fetching user:', err.message);
      alert('Failed to load user data.');
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await axios.post('https://college-even-backend-2.onrender.com/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err.message);
      alert('Failed to logout.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('category', category);
    formData.append('description', description);

    try {
      await axios.post('https://college-even-backend-2.onrender.com/api/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Photo uploaded successfully.');
      setPhoto(null);
      setCategory('');
      setDescription('');
    } catch (err) {
      console.error('Upload error:', err.message);
      alert('Failed to upload photo.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <div>
      <header className="bg-blue-500 text-white py-4 font-bold">
        <nav className="flex justify-between items-center px-6">
          <ul className="flex items-center gap-6">
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
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:underline">
                Logout
              </button>
            </li>
            <li onClick={() => navigate('/profile')} className="cursor-pointer">
              <img
                src={profilePhoto}
                alt="User"
                className="w-10 h-10 rounded-full ml-4"
              />
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload a Photo</h1>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <textarea
            placeholder="Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Upload Photo
          </button>
        </form>
      </main>
    </div>
  );
};

export default UploadPhoto;