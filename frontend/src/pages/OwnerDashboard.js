import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI, bookingAPI } from '../services/api';
import '../styles/OwnerDashboard.css';

function OwnerDashboard({ user, onLogout }) {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('properties');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Memoize fetchProperties using useCallback
  // This function depends on 'user', 'setProperties', and 'setLoading'.
  const fetchProperties = useCallback(async () => {
    try {
      const { data } = await propertyAPI.getAll();
      setProperties(data.filter((p) => p.ownerId === user?.id));
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  }, [user, setProperties, setLoading]);

  // 2. Memoize fetchBookings using useCallback
  // This function depends on 'setBookings'.
  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await bookingAPI.getOwnerBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, [setBookings]);

  // 3. Fix the useEffect hook dependency array (Line 23)
  // The effect now depends on the stable versions of the functions.
  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, [fetchProperties, fetchBookings]); // <-- FIX: Includes stable dependencies

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      await propertyAPI.create(formData);
      alert('Property added successfully!');
      setFormData({ title: '', description: '', location: '', pricePerNight: '' });
      setShowForm(false);
      // Call the stable function version
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add property');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await propertyAPI.delete(id);
        alert('Property deleted!');
        // Call the stable function version
        fetchProperties();
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await bookingAPI.approve(bookingId);
      alert('Booking approved!');
      // Call the stable function version
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await bookingAPI.reject(bookingId);
      alert('Booking rejected!');
      // Call the stable function version
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="owner-dashboard-container">
      <header className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'properties' ? 'active' : ''}
          onClick={() => setActiveTab('properties')}
        >
          My Properties
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Booking Requests
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {activeTab === 'properties' && (
            <div className="content-section">
              <div className="section-header">
                <h2>My Properties</h2>
                <button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Property'}
                </button>
              </div>

              {showForm && (
                <form className="property-form" onSubmit={handleAddProperty}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price per night"
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerNight: e.target.value })
                    }
                    required
                  />
                  <button type="submit">Create Property</button>
                </form>
              )}

              {properties.length === 0 ? (
                <p>No properties yet</p>
              ) : (
                <div className="properties-grid">
                  {properties.map((property) => (
                    <div key={property.id} className="property-card">
                      <h3>{property.title}</h3>
                      <p>{property.description}</p>
                      <p><strong>Location:</strong> {property.location}</p>
                      <p><strong>Price:</strong> ${property.pricePerNight}/night</p>
                      <button onClick={() => handleDeleteProperty(property.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="content-section">
              <h2>Booking Requests</h2>
              {bookings.length === 0 ? (
                <p>No booking requests</p>
              ) : (
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Customer</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.property?.title}</td>
                        <td>{booking.customer?.name}</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          {booking.status === 'Pending' && (
                            <>
                              <button
                                className="approve-btn"
                                onClick={() => handleApproveBooking(booking.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="reject-btn"
                                onClick={() => handleRejectBooking(booking.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OwnerDashboard;