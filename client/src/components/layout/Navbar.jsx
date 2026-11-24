import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-rose-500 font-bold text-2xl tracking-tight"
        >
          airbnb
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition cursor-pointer gap-3">
          <span className="text-sm font-medium text-gray-700">Anywhere</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Any week</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-400">Add guests</span>
          <div className="bg-rose-500 text-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition"
          >
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {/* Avatar */}
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              {user ? (
                <>
                  <p className="px-4 py-2 text-sm text-gray-500">
                    Hi, {user.name}
                  </p>
                  <hr className="my-1" />
                  <Link
                    to="/trips"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Trips
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
