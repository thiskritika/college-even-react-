import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://college-even-backend-2.onrender.com/default-profile-photo.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        setPhoto(null);
        setPreviewImage(null);
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        setPhoto(null);
        setPreviewImage(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert('Please select a photo to upload');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('category', category);
    formData.append('description', description);

    try {
      setIsLoading(true);
      await axios.post('https://college-even-backend-2.onrender.com/api/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Photo uploaded successfully!');
      setPhoto(null);
      setCategory('');
      setDescription('');
      setPreviewImage(null);
    } catch (err) {
      console.error('Upload error:', err.message);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

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
              <a href="/upload" className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload Photos</span>
              </a>
              <a href="/view" className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>View Photos</span>
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
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/20 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Photos</span>
                </a>
                <a 
                  href="/view" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>View Photos</span>
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
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Share Your Moment</h1>
            <p className="text-gray-600 text-lg">Upload and share your photos with the community</p>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 md:p-8">
              {/* File Upload Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Photo
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition duration-200 bg-gray-50">
                  {previewImage ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="max-h-64 rounded-lg shadow-md mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto(null);
                            setPreviewImage(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Photo selected successfully
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Drag & drop your photo here or click to browse</p>
                        <p className="text-sm text-gray-500">Supports: JPEG, PNG, GIF • Max: 10MB</p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Category Input */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="category"
                    placeholder="e.g., Nature, Portrait, Event, Travel"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="mb-8">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <textarea
                    id="description"
                    placeholder="Tell us about this photo..."
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  ></textarea>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Photo
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Upload Tips
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Use high-quality images for better viewing experience</li>
              <li>• Add descriptive categories to help others find your photos</li>
              <li>• Write meaningful descriptions to share the story behind your photo</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;