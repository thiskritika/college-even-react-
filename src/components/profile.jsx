import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const redirectToLogin = useCallback(() => navigate('/login'), [navigate]);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      setIsLoading(true);
      const res = await axios.get('https://college-even-backend-2.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err.message);
      alert('Failed to load user data.');
    } finally {
      setIsLoading(false);
    }
  }, [redirectToLogin]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      setIsLoading(true);
      await axios.post(
        'https://college-even-backend-2.onrender.com/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('token');
      redirectToLogin();
    } catch (err) {
      console.error('Logout error:', err.message);
      alert('Failed to logout.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfilePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      setIsLoading(true);
      await axios.delete('https://college-even-backend-2.onrender.com/api/users/profile-photo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, profilePhoto: null }));
      alert('Profile photo removed successfully.');
    } catch (err) {
      console.error('Remove photo error:', err.message);
      alert('Failed to remove photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadNewPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      setIsLoading(true);
      const res = await axios.put('https://college-even-backend-2.onrender.com/api/users/profile-photo', formData, {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const profilePhotoSrc = user?.profilePhoto
    ? `https://college-even-backend-2.onrender.com/${user.profilePhoto.replace(/\\/g, '/')}`
    : '/default-avatar.png';

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;

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
              <span className="text-xl font-bold">CollegeEvent</span>
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
              <a href="/view" className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>View Photos</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
              </button>
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
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>View Photos</span>
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200 text-left"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-blue-100">Manage your profile and account settings</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="md:flex">
              {/* Profile Photo Section */}
              <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-indigo-50 p-8 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    <img
                      src={profilePhotoSrc}
                      alt={`${user.name}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Active</span>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{isLoading ? 'Uploading...' : 'Upload New Photo'}</span>
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={uploadNewPhoto}
                    accept="image/*"
                  />
                  
                  <button
                    onClick={removeProfilePhoto}
                    disabled={isLoading || !user.profilePhoto}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Information</h2>
                  <p className="text-gray-600">Your personal details and account information</p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 mb-2 block">Full Name</label>
                      <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 mb-2 block">Email Address</label>
                      <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 mb-2 block">Course</label>
                      <p className="text-lg font-semibold text-gray-800">{user.course}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <label className="text-sm font-medium text-blue-600 mb-2 block">College Year</label>
                      <p className="text-lg font-semibold text-gray-800">{user.collegeYear}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 mt-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Account Verified</h3>
                        <p className="text-green-600 text-sm">Your account is active and ready to use</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;