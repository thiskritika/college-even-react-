import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://college-even-backend-2.onrender.com/default-profile-photo.jpg');
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('https://college-even-backend-2.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const user = await res.json();
      const photoSrc = user.profilePhoto
        ? `https://college-even-backend-2.onrender.com/${user.profilePhoto.replace(/\\/g, '/')}`
        : 'https://college-even-backend-2.onrender.com/default-profile-photo.jpg';
      setProfilePhoto(photoSrc);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchYourPhotos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No token found. Please log in.');

    try {
      const res = await fetch('https://college-even-backend-2.onrender.com/api/photos/yourPhotos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch photos');
      const data = await res.json();
      setPhotos(data.photos);
    } catch (err) {
      console.error(err);
      alert('Failed to load your photos.');
    }
  };

  const deletePhoto = async (photoId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No token found. Please log in.');

    try {
      await fetch(`https://college-even-backend-2.onrender.com/api/photos/delete/${photoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchYourPhotos();
    } catch (err) {
      console.error(err);
      alert('Failed to delete the photo.');
    }
  };

  const updateDescription = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('No token found. Please log in.');

    try {
      await fetch(`https://college-even-backend-2.onrender.com/api/photos/update/${editingPhotoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: editDescription }),
      });
      setEditingPhotoId(null);
      setEditDescription('');
      fetchYourPhotos();
    } catch (err) {
      console.error(err);
      alert('Failed to update the description.');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No token found. Please log in.');

    try {
      await fetch('https://college-even-backend-2.onrender.com/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Failed to logout.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchYourPhotos();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 text-white shadow font-bold">
        <nav className="flex justify-between items-center px-6 py-4">
          <ul className="flex space-x-6 items-center">
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/upload" className="hover:underline">Upload Photos</a></li>
            <li><a href="/view" className="hover:underline">View Your Photos</a></li>
            <li>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </li>
          </ul>
          <div onClick={() => navigate('/profile')} className="cursor-pointer ml-4">
            <img src={profilePhoto} alt="User Profile" className="w-10 h-10 rounded-full" />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Your Uploaded Photos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo._id} className="bg-white rounded shadow p-4">
              <a href={`/photoDetails?id=${photo._id}`}>
                <img
                  src={`https://college-even-backend-2.onrender.com/${photo.url.replace(/\\/g, '/')}`}
                  alt="Uploaded"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-3 space-y-1">
                  <p><strong>Category:</strong> {photo.category || 'N/A'}</p>
                  <p><strong>Description:</strong> {photo.description || 'No description'}</p>
                  <p><strong>Date:</strong> {photo.date || 'N/A'}</p>
                </div>
              </a>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditingPhotoId(photo._id);
                    setEditDescription(photo.description);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deletePhoto(photo._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPhotoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={updateDescription}
            className="bg-white rounded p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Edit Description</h2>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingPhotoId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewPhotos;
