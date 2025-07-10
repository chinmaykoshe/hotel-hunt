import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navig() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
  const userId = localStorage.getItem("userId");
  const loggedIn = userId !== null && userId !== "";
  setIsLoggedIn(loggedIn);
}, []);

  return (
    <nav className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="text-xl font-bold">
            <Link to="/">Hotel Hunt</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/search" className="hover:text-gray-200">Search</Link>
            <Link to="/listings" className="hover:text-gray-200">Listings</Link>
            <Link to="/about" className="hover:text-gray-200">About</Link>
            {isLoggedIn ? (
              <Link to="/profile" className="hover:text-gray-200">Profile</Link>
            ) : (
              <Link to="/login" className="hover:text-gray-200">Login</Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium">
          <Link to="/" onClick={toggleMenu} className="block">Home</Link>
          <Link to="/search" onClick={toggleMenu} className="block">Search</Link>
          <Link to="/listings" onClick={toggleMenu} className="block">Listings</Link>
          <Link to="/about" onClick={toggleMenu} className="block">About</Link>
          {isLoggedIn ? (
            <Link to="/profile" onClick={toggleMenu} className="block">Profile</Link>
          ) : (
            <Link to="/login" onClick={toggleMenu} className="block">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navig;
