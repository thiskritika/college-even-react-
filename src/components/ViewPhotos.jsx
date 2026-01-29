import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://college-even-backend-2.onrender.com/default-profile-photo.jpg');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
      setIsLoading(true);
      const res = await fetch('https://college-even-backend-2.onrender.com/api/photos/yourPhotos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch photos');
      const data = await res.json();
      setPhotos(data.photos);
    } catch (err) {
      console.error(err);
      alert('Failed to load your photos.');
    } finally {
      setIsLoading(false);
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
      setDeleteConfirm(null);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchYourPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold">PhotoGallery</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </a>
              <a href="/upload" className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload Photos</span>
              </a>
              <a href="/view" className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>My Photos</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>

            {/* Profile Photo & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Desktop Profile Photo */}
              <div 
                onClick={() => navigate('/profile')}
                className="hidden md:block cursor-pointer transform hover:scale-105 transition duration-200"
              >
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=U';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition duration-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in">
              <div className="flex flex-col space-y-3">
                <a 
                  href="/dashboard" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </a>
                <a 
                  href="/upload" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Photos</span>
                </a>
                <a 
                  href="/view" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/20 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>My Photos</span>
                </a>
                <div className="flex items-center justify-between px-4 py-3">
                  <div 
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <img
                      src={profilePhoto}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=U';
                      }}
                    />
                    <span>Profile</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200 text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Photo Collection</h1>
          <p className="text-gray-600 text-lg">Manage and organize your uploaded photos</p>
          <div className="mt-4 flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{photos.length} Photos</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">Loading your photos...</p>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {!isLoading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div 
                key={photo._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
              >
                {/* Photo Container */}
                <div 
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/photoDetails/${photo._id}`)}
                >
                  <img
                    src={photo.url}
                    alt="Uploaded"
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                  
                  {/* Category Badge */}
                  {photo.category && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {photo.category}
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Description */}
                  <p className="text-gray-700 line-clamp-2 mb-3 font-medium">
                    {photo.description || 'No description provided'}
                  </p>

                  {/* Photo Details */}
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{photo.date ? new Date(photo.date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingPhotoId(photo._id);
                        setEditDescription(photo.description);
                      }}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition duration-200 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => setDeleteConfirm(photo._id)}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition duration-200 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && photos.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Photos Yet</h3>
              <p className="text-gray-600 mb-6">Start building your collection by uploading your first photo!</p>
              <a 
                href="/upload" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload Your First Photo</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPhotoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={updateDescription}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h2 className="text-xl font-bold">Edit Description</h2>
              <p className="text-blue-100 text-sm mt-1">Update your photo description</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  rows="4"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  placeholder="Enter a description for your photo..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPhotoId(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 font-medium"
                >
                  Update Description
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
              <h2 className="text-xl font-bold">Delete Photo</h2>
              <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Are you sure?</h3>
                  <p className="text-gray-600 text-sm">This photo will be permanently deleted.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePhoto(deleteConfirm)}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 font-medium"
                >
                  Delete Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPhotos;