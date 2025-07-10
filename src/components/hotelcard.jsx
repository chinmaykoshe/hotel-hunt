import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle card click
  const handleClick = () => {
    navigate(`/hotels/${hotel._id}`); // Assuming each hotel has a unique _id in MongoDB
  };

  return (
    <div
      className="group w-full h-auto overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative cursor-pointer"
      onClick={handleClick} // Add the click handler
    >
      {/* Hotel Image */}
      <div className="w-full h-48 lg:h-[280px] overflow-hidden rounded-lg relative">
        <img
          src={hotel.imageofroom}
          alt={hotel.name}
          onError={(e) => (e.target.src = "fallback-image-url")} // Fallback image URL
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95 rounded-lg"
        />
        {/* Rate Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm font-bold">
          Rs {hotel.pricepernight} / night
        </div>
      </div>

      {/* Hotel Name */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white text-sm p-3 rounded-b-lg">
        <h3 className="font-semibold">{hotel.name}</h3>
        <h3 className="font-semibold">{hotel.loc}</h3>
      </div>
    </div>
  );
};

export default HotelCard;
