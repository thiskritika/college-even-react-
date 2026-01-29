import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewAllPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('https://college-even-backend-2.onrender.com/default-profile-photo.jpg');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToLogin = useCallback(() => {
    if (location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      const res = await axios.get('https://college-even-backend-2.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      const photoSrc = user.profilePhoto
        ? `https://college-even-backend-2.onrender.com/${user.profilePhoto.replace(/\\/g, '/')}`
        : 'https://college-even-backend-2.onrender.com/default-profile-photo.jpg';

      setProfilePhoto(photoSrc);
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response && err.response.status === 403) {
        localStorage.removeItem("token");
        redirectToLogin();
      } else {
        alert('Failed to load user data.');
      }
    }
  }, [redirectToLogin]);

  const fetchAllPhotos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      setIsLoading(true);
      const res = await axios.get('https://college-even-backend-2.onrender.com/api/photos/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPhotos(res.data.photos);
    } catch (err) {
      console.error('Error fetching photos:', err);
      if (err.response && err.response.status === 403) {
        localStorage.removeItem("token");
        redirectToLogin();
      } else {
        alert('Failed to load photos.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [redirectToLogin]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return redirectToLogin();

    try {
      await axios.post(
        'https://college-even-backend-2.onrender.com/api/auth/logout',
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAllPhotos();
  }, [fetchUserProfile, fetchAllPhotos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Community Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing photos shared by our community members
          </p>
          <div className="mt-6 flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{photos.length} Photos</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Multiple Users</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">Loading photos...</p>
              <p className="text-gray-500">Discovering amazing content</p>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => {
              const photoUrl = photo.url;
              const userProfile = photo.user?.profilePhoto
                ? `https://college-even-backend-2.onrender.com/${photo.user.profilePhoto.replace(/\\/g, '/')}`
                : 'https://college-even-backend-2.onrender.com/default-profile-photo.jpg';

              return (
                <div 
                  key={photo._id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/photoDetails/${photo._id}`)}
                >
                  {/* Photo Container */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={photoUrl} 
                      alt={photo.description || 'Community photo'} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                      <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Description */}
                    <p className="text-gray-700 line-clamp-2 mb-4 font-medium">
                      {photo.description || 'No description provided'}
                    </p>

                    {/* User Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={userProfile}
                          alt={photo.user?.name || 'User'}
                          className="w-8 h-8 rounded-full border-2 border-blue-100 shadow-sm"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=U';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{photo.user?.name}</p>
                          <p className="text-xs text-gray-500">Photographer</p>
                        </div>
                      </div>
                      
                      {/* View Details Button */}
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                        <span>View</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              <p className="text-gray-600 mb-6">Be the first to share your photos with the community!</p>
              <a 
                href="/upload" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload First Photo</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllPhotos;