import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PhotoDetails = () => {
  const { id: photoId } = useParams();
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      if (!photoId) {
        setError('No photo ID provided in URL');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://college-even-backend-2.onrender.com/api/photos/${photoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPhoto(res.data.photo);
      } catch (err) {
        console.error('Error fetching photo details:', err.message);
        setError('Failed to load photo details.');
      }
    };

    fetchPhotoDetails();
  }, [photoId]);

  if (error) return <div className="max-w-3xl mx-auto p-6 text-red-500">{error}</div>;
  if (!photo) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;

  const photoUrl = photo.url ? `https://college-even-backend-2.onrender.com/${photo.url.replace(/\\/g, '/')}` : '';
  const profilePhoto = photo.userId?.profilePhoto
    ? `https://college-even-backend-2.onrender.com/${photo.userId.profilePhoto.replace(/\\/g, '/')}`
    : 'https://college-even-backend-2.onrender.com/default-profile-photo.jpg';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src={photoUrl}
          alt=""
          className="w-full max-h-[500px] object-cover rounded"
        />

        <div className="flex items-center gap-4 mt-4">
          <img
            src={profilePhoto}
            alt=""
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <div className="text-lg font-semibold">
              Name: {photo.userId?.name || 'Unknown User'}
            </div>
            <div className="text-sm text-gray-600">
              Course: {photo.userId?.course || 'N/A'}
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <p className="text-base text-gray-800">
            <strong>Description:</strong>{' '}
            {photo.description || 'No description available'}
          </p>
          <p className="text-base text-gray-800 mt-2">
            <strong>Date:</strong> {photo.date || 'Unknown date'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;