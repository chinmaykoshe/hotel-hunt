import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanal from "./components/AdminPanel";
import Navig from "./components/navig";
import Footer from "./components/footer";
import Home from "./components/home";
import SearchPage from "./components/searchpage";
import Listings from "./components/listings";
import HotelDetails from "./components/hoteldetails";
import AboutUs from "./components/aboutus";
import Login from "./components/login";
import Profile from "./components/profile";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[url('//public/bgimage.avif')] bg-cover bg-center bg-no-repeat">
        <Navig />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/hotels/:hotelId" element={<HotelDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin" element={<AdminPanal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
