// // src/components/index.js
// src/components/index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('https://college-even-backend-2.onrender.com/api/photos/all')
      .then((response) => {
        console.log('✅ API Response:', response.data);
        setPhotos(response.data.photos || []);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(photos.map(photo => photo.category).filter(Boolean))];

  // Filter photos based on category and search term
  const filteredPhotos = photos.filter(photo => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const matchesSearch = photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Community Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing moments captured by our community members
          </p>
        </div>

        {/* Stats and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{photos.length}</div>
                <div className="text-sm text-gray-500">Total Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">Loading photos...</p>
              <p className="text-gray-500">Discovering amazing content from our community</p>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {!isLoading && (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredPhotos.length}</span> of <span className="font-semibold">{photos.length}</span> photos
                {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <select className="border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700">
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo, index) => {
                const imageUrl = photo.url;

                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={photo.description || `Community photo ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          console.error('❌ Image failed to load:', imageUrl);
                          e.target.src = 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Image+Not+Found';
                        }}
                        onLoad={() => console.log('✅ Image loaded:', imageUrl)}
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
                      <p className="text-gray-700 line-clamp-2 mb-3 font-medium">
                        {photo.description || 'No description provided'}
                      </p>

                      {/* Photo Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Recently added</span>
                        </div>
                        
                        {/* View Button */}
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition duration-200">
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
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {photos.length === 0 ? 'No Photos Yet' : 'No Photos Found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {photos.length === 0 
                  ? 'Be the first to share your photos with the community!' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {photos.length === 0 && (
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload First Photo</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {!isLoading && filteredPhotos.length > 0 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium">
              <span>Load More Photos</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPhotos;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ViewPhotos = () => {
//   const [photos, setPhotos] = useState([]);

//   useEffect(() => {
//     axios
//       .get('https://college-even-backend-2.onrender.com/api/photos/all')
//       .then((response) => {
//         setPhotos(response.data.photos || []);
//       })
//       .catch((error) => {
//         console.error('Error fetching photos:', error);
//       });
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <h1 className="text-2xl font-bold text-center mb-8">All Uploaded Photos</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {photos.map((photo, index) => {
//           const imageUrl = photo.url?.startsWith('http')
//             ? photo.url
//             : `https://college-even-backend-2.onrender.com/${photo.url?.replace(/\\/g, '/')}`;

//           return (
//             <div key={index} className="bg-white rounded shadow p-4">
//               <img
//                 src={imageUrl}
//                 alt={photo.description || `Photo ${index + 1}`}
//                 className="w-full h-48 object-cover rounded mb-2"
//               />
//               <p className="text-sm text-gray-700">{photo.description}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ViewPhotos;
