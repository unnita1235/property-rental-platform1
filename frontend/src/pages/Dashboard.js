import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [paymentForm, setPaymentForm] = useState({ bookingId: '', amount: '', paymentMethod: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getCustomerBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data } = await paymentAPI.getAll();
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments');
    }
  };

  const handlePayment = async () => {
    if (!paymentForm.bookingId || !paymentForm.amount || !paymentForm.paymentMethod) {
      alert('Please fill all payment fields');
      return;
    }

    try {
      await paymentAPI.record(paymentForm);
      alert('Payment recorded successfully!');
      setPaymentForm({ bookingId: '', amount: '', paymentMethod: '' });
      fetchBookings();
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {activeTab === 'bookings' && (
            <div className="content-section">
              <h2>Your Bookings</h2>
              {bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th>Total Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.property?.title}</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          {booking.status === 'Approved' && !booking.payment && (
                            <button
                              onClick={() =>
                                setPaymentForm({
                                  bookingId: booking.id,
                                  amount: booking.totalPrice,
                                  paymentMethod: '',
                                })
                              }
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="content-section">
              <h2>Payment History</h2>
              {payments.length === 0 ? (
                <p>No payments yet</p>
              ) : (
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.bookingId.substring(0, 8)}</td>
                        <td>${payment.amount}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>{payment.status}</td>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {paymentForm.bookingId && (
        <div className="payment-modal">
          <div className="modal-content">
            <h3>Complete Payment</h3>
            <p>Amount: ${paymentForm.amount}</p>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
              }
            >
              <option value="">Select payment method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <button onClick={handlePayment}>Pay Now</button>
            <button onClick={() => setPaymentForm({ bookingId: '', amount: '', paymentMethod: '' })}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;