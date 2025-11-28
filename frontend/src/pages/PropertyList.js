import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI, bookingAPI } from '../services/api';
import '../styles/PropertyList.css';

function PropertyList({ user }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingDates, setBookingDates] = useState({ checkInDate: '', checkOutDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await propertyAPI.getAll();
      setProperties(data);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingDates.checkInDate || !bookingDates.checkOutDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    try {
      await bookingAPI.request({
        propertyId: selectedProperty.id,
        checkInDate: bookingDates.checkInDate,
        checkOutDate: bookingDates.checkOutDate,
      });
      alert('Booking request submitted successfully!');
      setSelectedProperty(null);
      setBookingDates({ checkInDate: '', checkOutDate: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="loading">Loading properties...</div>;

  return (
    <div className="property-list-container">
      <header className="header">
        <h1>Available Properties</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/dashboard')}>My Bookings</button>
          <button onClick={() => navigate('/login')}>Logout</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="properties-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <h3>{property.title}</h3>
            <p><strong>Location:</strong> {property.location}</p>
            <p>{property.description}</p>
            <p><strong>Price:</strong> ${property.pricePerNight}/night</p>
            <p><strong>Owner:</strong> {property.owner?.name}</p>
            <button onClick={() => setSelectedProperty(property)}>Book Now</button>
          </div>
        ))}
      </div>

      {selectedProperty && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedProperty(null)}>&times;</span>
            <h2>Book: {selectedProperty.title}</h2>
            <div className="booking-form">
              <input
                type="date"
                value={bookingDates.checkInDate}
                onChange={(e) =>
                  setBookingDates({ ...bookingDates, checkInDate: e.target.value })
                }
                placeholder="Check-in date"
              />
              <input
                type="date"
                value={bookingDates.checkOutDate}
                onChange={(e) =>
                  setBookingDates({ ...bookingDates, checkOutDate: e.target.value })
                }
                placeholder="Check-out date"
              />
              <button onClick={handleBooking}>Submit Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyList;