import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // Reload to reset state
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-8 mt-10 rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Profile</h1>

      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">User ID:</span> {user.id}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
