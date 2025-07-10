import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newHotel, setNewHotel] = useState({
    name: '',
    imageofroom: '',
    loc: '',
    pricepernight: '',
    amenities: '',
    areaofroom: ''
  });

  useEffect(() => {
    fetchHotels();
    fetchBookings();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/hotels');
      setHotels(res.data);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/addhotel", newHotel);
      setNewHotel({
        name: '',
        imageofroom: '',
        loc: '',
        pricepernight: '',
        amenities: '',
        areaofroom: ''
      });
      fetchHotels();
    } catch (err) {
      console.error("Error adding hotel:", err);
    }
  };

  const deleteHotel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/hotels/${id}`);
      fetchHotels();
    } catch (err) {
      console.error("Failed to delete hotel:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'hotels'
              ? 'bg-white border-t border-l border-r border-gray-200 text-gray-800'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Hotels
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'bookings'
              ? 'bg-white border-t border-l border-r border-gray-200 text-gray-800'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Bookings
        </button>
      </div>

      <div className="bg-white shadow rounded-b-lg p-6">
        {activeTab === 'hotels' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Add Hotel</h2>
            <form onSubmit={handleAddHotel} className="grid grid-cols-2 gap-4 mb-8">
              <input
                type="text"
                placeholder="Hotel Name"
                value={newHotel.name}
                onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newHotel.imageofroom}
                onChange={e => setNewHotel({ ...newHotel, imageofroom: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newHotel.loc}
                onChange={e => setNewHotel({ ...newHotel, loc: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Price Per Night"
                value={newHotel.pricepernight}
                onChange={e => setNewHotel({ ...newHotel, pricepernight: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Amenities (comma separated)"
                value={newHotel.amenities}
                onChange={e => setNewHotel({ ...newHotel, amenities: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Room Area (e.g., 30 sq.ft)"
                value={newHotel.areaofroom}
                onChange={e => setNewHotel({ ...newHotel, areaofroom: e.target.value })}
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Add Hotel
              </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">All Hotels</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Room Area</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="border-t">
                    <td className="px-4 py-2">{hotel.name}</td>
                    <td className="px-4 py-2">{hotel.loc}</td>
                    <td className="px-4 py-2">Rs {hotel.pricepernight}</td>
                    <td className="px-4 py-2">{hotel.areaofroom}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteHotel(hotel._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>

            {loading && <p className="text-gray-500">Loading bookings...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && bookings.length > 0 && (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Hotel Name</th>
                    <th className="px-4 py-2 text-left">Hotel Location</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Check-In</th>
                    <th className="px-4 py-2 text-left">Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-t">
                      <td className="px-4 py-2">{booking.hotelId?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{booking.hotelId?.loc || 'N/A'}</td>
                      <td className="px-4 py-2">{booking.name}</td>
                      <td className="px-4 py-2">{booking.email}</td>
                      <td className="px-4 py-2">{booking.phone}</td>
                      <td className="px-4 py-2">
                        {booking.checkin
                          ? new Date(booking.checkin).toLocaleString()
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {booking.checkout
                          ? new Date(booking.checkout).toLocaleString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && !error && bookings.length === 0 && (
              <p className="text-gray-600">No bookings found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
