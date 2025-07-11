import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPhotos = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios
      .get('https://college-even-backend-2.onrender.com/api/photos/all')
      .then((response) => {
        setPhotos(response.data.photos || []);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">All Uploaded Photos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo, index) => {
          const imageUrl = photo.url?.startsWith('http')
            ? photo.url
            : `https://college-even-backend-2.onrender.com/${photo.url?.replace(/\\/g, '/')}`;

          return (
            <div key={index} className="bg-white rounded shadow p-4">
              <img
                src={imageUrl}
                alt={photo.description || `Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p className="text-sm text-gray-700">{photo.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewPhotos;
