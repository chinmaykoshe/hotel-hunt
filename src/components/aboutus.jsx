import React from 'react';

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 shadow-md rounded-lg mt-10">
      <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-6">About Hotel Hunt</h1>

      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
        Welcome to <span className="font-semibold text-blue-500">Hotel Hunt</span> – your trusted partner in finding the best hotels for every trip, whether you're planning a vacation, a business stay, or a weekend getaway.
      </p>

      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
        Our mission is simple: to help travelers discover top-rated hotels, explore room amenities, and book the perfect stay — all in one place. 
        We combine intuitive design, real-time availability, and genuine user reviews to bring you the most reliable hotel booking experience.
      </p>

      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
        Founded in 2025 by a team of travel enthusiasts and developers, Hotel Hunt was built to solve the ultimate travel question: 
        <span className="italic text-blue-500">“Where should we stay tonight?”</span>
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">🏨 What We Offer</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
        <li>🔍 Search by location, budget, or amenities</li>
        <li>📝 Verified reviews from real guests</li>
        <li>📍 Interactive map with hotel locations</li>
        <li>❤️ Save favorite hotels and plan future trips</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">🌟 Join Us</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Ready to book your next stay? Discover your ideal accommodation with <span className="font-semibold text-blue-500">Hotel Hunt</span>.
        The comfort you deserve is just a click away.
      </p>
    </div>
  );
}

export default AboutUs;
