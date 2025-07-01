import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewAllPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('http://localhost:5000/default-profile-photo.jpg');
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      const photoSrc = user.profilePhoto
        ? `http://localhost:5000/${user.profilePhoto.replace(/\\/g, '/')}`
        : 'http://localhost:5000/default-profile-photo.jpg';

      setProfilePhoto(photoSrc);
    } catch (err) {
      console.error('Error fetching user:', err);
      alert('Failed to load user data.');
    }
  };

  const fetchAllPhotos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      const res = await axios.get('http://localhost:5000/api/photos/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPhotos(res.data.photos);
    } catch (err) {
      console.error('Error fetching photos:', err);
      alert('Failed to load photos.');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem('token');
      redirectToLogin();
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to logout.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAllPhotos();
  }, []);

  return (
    <div>
      <header className="bg-blue-500 text-white shadow  font-bold">
        <nav className="flex justify-between items-center px-6 py-4">
          <ul className="flex space-x-6 items-center">
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
                className="flex items-center gap-2 hover:underline text-white-400"
              >

                Logout
              </button>
            </li>
          </ul>
          <div
            onClick={() => navigate('/profile')}
            className="cursor-pointer ml-4"
          >
            <img
              src={profilePhoto}
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </nav>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">All Uploaded Photos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => {
            const photoUrl = `http://localhost:5000/${photo.url.replace(/\\/g, '/')}`;
            const userProfile = photo.user?.profilePhoto
              ? `http://localhost:5000/${photo.user.profilePhoto.replace(/\\/g, '/')}`
              : 'http://localhost:5000/default-profile-photo.jpg';

            return (
              <div key={photo._id} className="bg-white rounded shadow overflow-hidden">
                <a href={`/photoDetails?id=${photo._id}`}>
                  <img src={photoUrl} alt="Photo" className="w-full h-48 object-cover" />

                  {/* Category & Description */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600"><strong>Category:</strong> {photo.category || 'N/A'}</p>
                    <p className="text-sm text-gray-800 mt-1"><strong>Description:</strong> {photo.description || 'No description'}</p>
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border-t">
                    <img
                      src={userProfile}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full border"
                    />
                    <div className="font-medium">{photo.user?.name}</div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewAllPhotos;
