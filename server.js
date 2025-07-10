const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

app.use(express.json()); // <-- important!

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/restaurant-hunt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Hotel Schema
const hotelSchema = new mongoose.Schema({
  name: String,
  imageofroom: String,
  loc: String,
  pricepernight: Number,
  amenities: String,
  areaofroom: String,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,   // auto filled
  email: String,  // auto filled
  phone: String,  // auto filled
  checkin: String,
  checkout: String,
});


const Booking = mongoose.model('Booking', bookingSchema);


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  mobno: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// POST: Signup/Login Combined
app.post('/auth/:action', async (req, res) => {
  const { action } = req.params;
  const { name, email, password, mobno } = req.body;

  try {
    if (action === 'signup') {
      if (!name || !email || !mobno || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existing = await User.findOne({
        $or: [{ email }, { mobno }]
      });
      if (existing) {
        return res.status(400).json({
          message: 'User already exists with same email or mobile number'
        });
      }

      const newUser = new User({ name, email, mobno, password });
      await newUser.save();
      return res.status(201).json({ message: 'Signup successful' });
    }


    if (action === 'login') {
      const user = await User.findOne({ email, password });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      return res.json({
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    res.status(400).json({ message: 'Invalid action' });

  } catch (err) {
    console.error('💥 Server Error:', err.message);

    if (err.code === 11000) {
      // duplicate key error
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate value for ${field}: ${err.keyValue[field]}`
      });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }

});




// GET: All Users (for testing/demo)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// 1) Search first
app.get("/hotels/search", async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid search query" });
  }
  const regex = new RegExp(query, "i");
  const isNum = !isNaN(query);
  const conditions = [
    { name: regex },
    { loc: regex },
    { amenities: regex },
    { areaofroom: regex },
    ...(isNum ? [{ pricepernight: Number(query) }] : [])
  ];
  try {
    const results = await Hotel.find({ $or: conditions });
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});



app.post('/bookings', async (req, res) => {
  const { userId, hotelId, checkin, checkout } = req.body;

  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newBooking = new Booking({
      hotelId,
      userId,
      name: user.name,
      email: user.email,
      phone: user.mobno,
      checkin,
      checkout
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful', booking: newBooking });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post("/addhotel", async (req, res) => {
  try {
    console.log("Received body:", req.body); // Add this line for debug
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.status(201).json({ message: "Hotel added successfully" });
  } catch (error) {
    console.error("Error saving hotel:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all hotels
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels', error });
  }
});

app.get('/api/bookings/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ userId }).populate('hotelId', 'name loc'); // Optional populate hotel info
    res.json(bookings);

  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')      // optional: show user name/email
      .populate('hotelId', 'name loc'); // optional: show hotel name/location

    res.json(bookings);
  } catch (error) {
    console.error('Get All Bookings Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/hotels/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Hotel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ message: 'Error deleting hotel', error });
  }
});

app.get('/hotels/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ message: 'Error fetching hotel details', error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
