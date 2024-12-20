import { useState, useEffect } from "react";
import Products from "./Products";
import Filters from "./Filters";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const [filters, setFilters] = useState({
    category: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token found, redirect to login page
      navigate('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }), // Pass token to backend
        });

        const data = await response.json();

        if (data.success) {
          console.log('Token is valid', data.data.userId);
        } else {
          console.error(data.message);
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyToken();

  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="homepageWrapper">
        <Filters setFilters={setFilters} />
        <div>
          <Products filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
