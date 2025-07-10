import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Listings = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/hotels');
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <div
          key={hotel._id}
          className="flex bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
        >
          <img
            src={hotel.imageofroom}
            alt={hotel.name}
            className="w-[100px] h-[100px] object-cover"
          />
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {hotel.name}
              </h3>
              <p className="text-gray-600 text-sm">{hotel.loc}</p>
              <p className="text-green-600 font-medium mt-1">
                ₹ {hotel.pricepernight} / night
              </p>
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {hotel.amenities
                    .split(',')
                    .map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                      >
                        {amenity.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>
            <div className="mt-3">
              <Link
                to={`/hotels/${hotel._id}`}
                className="inline-block text-center w-full bg-green-600 text-white text-sm font-medium py-2 rounded hover:bg-green-700 transition duration-300"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Listings;
