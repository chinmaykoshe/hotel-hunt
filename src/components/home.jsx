import React, { useState, useEffect } from "react";
import HotelCard from "./hotelcard";
import {
  FaBed,
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaRegCommentDots,
  FaKey,
} from "react-icons/fa";

function Home() {
  const [hotels, setHotels] = useState([]);
  const [randomHotels, setRandomHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5000/hotels");
        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    if (hotels.length > 0) {
      const shuffled = [...hotels].sort(() => Math.random() - 0.5);
      setRandomHotels(shuffled.slice(0, 4));
    }
  }, [hotels]);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-blue-800  text-white py-20 px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: 'url("/hotel-banner.jpg")' }}
        ></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Book Your Perfect Stay</h1>
          <p className="text-lg mb-8">
            Discover top-rated hotels with amazing amenities and comfort.
          </p>
          <a
            href="/"
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-300 transition duration-300"
          >
            Start Booking
          </a>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-12 px-6">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Hotels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomHotels.length > 0 ? (
            randomHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.name} hotel={hotel} />
            ))
          ) : (
            <p>Loading hotels...</p>
          )}
        </div>
      </section>

      {/* Why Stay With Us */}
      <section className="py-12 bg-gray-200">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Why Stay With Us?
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          <div className="text-center">
            <FaBed className="text-5xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Luxury & Comfort</h3>
            <p>
              Enjoy top-tier amenities and relaxing rooms that make you feel at
              home.
            </p>
          </div>
          <div className="text-center">
            <FaStar className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted Reviews</h3>
            <p>
              Browse verified guest reviews to choose the best stay for your
              trip.
            </p>
          </div>
          <div className="text-center">
            <FaMapMarkerAlt className="text-5xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
            <p>
              Find hotels in key areas with easy access to attractions and
              transit.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-8">
          How It Works
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6">
          <div className="text-center">
            <FaSearch className="text-5xl text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Search Hotels</h3>
            <p>
              Find hotels by city, price, or amenities that match your travel
              plans.
            </p>
          </div>
          <div className="text-center">
            <FaRegCommentDots className="text-5xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compare & Review</h3>
            <p>
              Read feedback from real guests to choose the perfect place to
              stay.
            </p>
          </div>
          <div className="text-center">
            <FaKey className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Book & Check-In</h3>
            <p>
              Book instantly and check in easily at your selected hotel.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-800 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Book?</h2>
        <p className="text-lg mb-6">
          Find your perfect room and experience comfort like never before.
        </p>
        <a
          href="/login"
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-300 transition duration-300"
        >
          Sign Up Now
        </a>
      </section>
    </div>
  );
}

export default Home;
