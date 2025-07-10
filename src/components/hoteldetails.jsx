import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaWifi,
  FaSnowflake,
  FaTv,
  FaChair,
  FaParking,
  FaSwimmingPool,
  FaTree,
  FaUmbrellaBeach,
  FaUtensils,
  FaWater,
  FaQuestionCircle,
} from 'react-icons/fa';

function HotelDetails() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/hotels/${hotelId}`);
        if (!res.ok) throw new Error('Failed to fetch hotel details');
        setHotel(await res.json());
      } catch (err) {
        console.error(err);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUserId(u.id);
      setUser(u);
      setForm((prev) => ({
        ...prev,
        name: u.name || '',
        email: u.email || '',
        phone: u.mobno || '',
      }));
    }
  }, []);

  const amenitiesList = hotel?.amenities
    ? hotel.amenities.split(';').map((a) => a.trim())
    : [];

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'ac':
        return <FaSnowflake />;
      case 'free wifi':
        return <FaWifi />;
      case 'tv':
        return <FaTv />;
      case 'balcony':
        return <FaChair />;
      case 'free parking':
        return <FaParking />;
      case 'swimming pool':
        return <FaSwimmingPool />;
      case 'garden view':
        return <FaTree />;
      case 'beach access':
        return <FaUmbrellaBeach />;
      case 'restaurant':
        return <FaUtensils />;
      case 'sea view':
        return <FaWater />;
      default:
        return <FaQuestionCircle />;
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!form.checkin || !form.checkout) {
      setBookingError('Please select check-in and check-out.');
      return;
    }

    if (!userId) {
      setBookingError('Please sign in to make a booking.');
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          hotelId,
          checkin: form.checkin,
          checkout: form.checkout,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');

      setBookingSuccess('Your booking is confirmed!');
      alert('✅ Booking Confirmed!');
      setForm((prev) => ({
        ...prev,
        checkin: '',
        checkout: '',
      }));
    } catch (err) {
      console.error(err);
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (!hotel)
    return (
      <div className="text-center text-2xl text-gray-700">
        Loading hotel details...
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Hotel Info */}
      <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-xl overflow-hidden">
        <img
          src={hotel.imageofroom}
          alt={hotel.name}
          className="w-full lg:w-1/2 object-cover rounded-lg"
          onError={(e) => (e.target.src = 'fallback-image-url')}
        />
        <div className="w-full lg:w-1/2 p-6">
          <h1 className="text-5xl font-bold">{hotel.name},</h1>
          <p className="text-3xl text-gray-600 mt-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-green-600 text-2xl" />
            <span>{hotel.loc}</span>
          </p>
          <p className="text-4xl text-gray-800 mt-4">
            Price / Night:{' '}
            <strong className="text-green-600">
              Rs {hotel.pricepernight}
            </strong>
          </p>
          <p className="text-3xl text-gray-600 mt-4">{hotel.areaofroom}</p>

        </div>
      </div>

      {/* Amenities */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenitiesList.map((amenity, i) => (
            <li
              key={i}
              className="flex items-center text-xl hover:text-green-500"
            >
              <span className="mr-2 text-green-600">
                {getAmenityIcon(amenity)}
              </span>
              <span>{amenity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Book Your Stay</h2>

        {bookingError && (
          <p className="text-red-500 mb-2">{bookingError}</p>
        )}
        {bookingSuccess && (
          <p className="text-green-600 mb-2">{bookingSuccess}</p>
        )}

        {!user ? (
          <p className="text-red-500">
            You need to be signed in to book this hotel.
          </p>
        ) : (
          <form
            onSubmit={handleBookingSubmit}
            className="space-y-4"
          >
            <input
              name="name"
              type="text"
              value={form.name}
              disabled
              className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              disabled
              className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
            />
            <input
              name="phone"
              type="tel"
              value={form.phone}
              disabled
              className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
            />

            <label className="block font-medium">
              Check-In Date & Time
            </label>
            <input
              name="checkin"
              type="datetime-local"
              value={form.checkin}
              onChange={handleFormChange}
              className="w-full p-3 border rounded"
              required
            />

            <label className="block font-medium">
              Check-Out Date & Time
            </label>
            <input
              name="checkout"
              type="datetime-local"
              value={form.checkout}
              onChange={handleFormChange}
              className="w-full p-3 border rounded"
              required
            />

            <button
              type="submit"
              disabled={bookingLoading}
              className={`w-full py-3 text-white rounded ${bookingLoading
                ? 'bg-gray-400'
                : 'bg-green-600 hover:bg-green-500'
                }`}
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default HotelDetails;
