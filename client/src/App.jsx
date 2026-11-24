import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TripsPage from "./pages/TripsPage";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trips" element={<TripsPage />} />
      </Routes>
    </div>
  );
}

export default App;
