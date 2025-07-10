import React, { useState, useEffect } from "react";
import HotelCard from "./hotelcard";
import { Link } from "react-router-dom";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [allHotels, setAllHotels] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 642; // md is 768px
      setIsMobile(mobile);
      if (!mobile) {
        setIsGridView(true); // always grid view on md and above
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch all hotels on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/hotels");
        const data = await res.json();
        setAllHotels(data);
        setResults(data);
      } catch (err) {
        console.error("Error fetching all hotels:", err);
        setError("Could not load hotels.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(allHotels);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/hotels/search?query=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not fetch results. Try again later.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, allHotels]);

  return (
    <div className="p-6 mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold mb-4">Search Hotels</h1>

      <input
        type="text"
        placeholder="Search by name, location, amenities..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded-md mb-4"
      />

      {/* Toggle view only on mobile */}
      {isMobile && (
        <div className="flex items-center mb-6">
          <span className="text-gray-700 mr-2">View:</span>
          <button
            onClick={() => setIsGridView(true)}
            className={`px-3 py-1 rounded-l border ${isGridView ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setIsGridView(false)}
            className={`px-3 py-1 rounded-r border ${!isGridView ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            List
          </button>
        </div>
      )}

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-600">No matching hotels found.</p>
      )}

      {/* Grid View */}
      {isGridView && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}

      {/* List View */}
      {!isGridView && isMobile && (
        <div className="space-y-4">
          {results.map((hotel) => (
            <div
              key={hotel._id}
              className="flex bg-white shadow rounded overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div>
                <img
                  src={hotel.imageofroom}
                  alt={hotel.name}
                  className="w-[100px] h-[100px] object-cover"
                />
                <p className="text-blue-600 font-medium mt-1 p-1">
                  ₹ {hotel.pricepernight} / night
                </p>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{hotel.loc}</p>
                </div>
                <div className="mt-3">
                  <Link
                    to={`/hotel/${hotel._id}`}
                    className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
