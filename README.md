# Property Rental Platform

A complete full-stack property rental platform with user authentication, property management, booking system, and payment processing.

## Features

✅ User Authentication (Owner & Customer roles)
✅ Secure Password Hashing with bcryptjs
✅ JWT Token-based Authorization
✅ Property Management (Create, Read, Update, Delete)
✅ Booking System with Status Workflow
✅ Payment Processing & Recording
✅ Role-Based Access Control
✅ RESTful API Architecture
✅ Responsive React Frontend
✅ MySQL Relational Database

## Technology Stack

**Backend:**
- Node.js & Express.js
- MySQL 2 (mysql2/promise)
- JWT for authentication
- bcryptjs for password hashing
- CORS support

**Frontend:**
- React 18
- React Router DOM
- Context API for state management
- Axios for API calls
- CSS3

**Database:**
- MySQL 8.0+

## Project Structure
property-rental-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   └── Payment.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── bookings.js
│   │   └── payments.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── .env
│   └── package.json
├── database/
│   └── schema.sql
└── README.md

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## Environment Variables

### Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password123
DB_NAME=property_rental_db
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development

### Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Owner only)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner only)

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking (Customer only)
- `PATCH /api/bookings/:id/status` - Update status (Owner only)

### Payments
- `POST /api/payments` - Record payment (Customer only)
- `GET /api/payments` - Get all payments
- `GET /api/payments/booking/:bookingId` - Get payment by booking

## Booking Status Workflow

1. **Pending** - Customer creates booking request
2. **Approved** - Owner approves the booking
3. **Rejected** - Owner rejects the booking
4. **Completed** - Customer records payment

## Sample User Accounts

**Owner Account:**
- Email: `owner@test.com`
- Password: `password123`
- Role: Owner

**Customer Account:**
- Email: `customer@test.com`
- Password: `password123`
- Role: Customer

## Database Schema

### Users Table
- id (UUID)
- email (Unique)
- password (Hashed)
- role (Owner/Customer)
- created_at

### Properties Table
- id (UUID)
- owner_id (Foreign Key)
- name
- description
- location
- price_per_night
- total_bedrooms
- created_at
- deleted_at (Soft delete)

### Bookings Table
- id (UUID)
- customer_id (Foreign Key)
- property_id (Foreign Key)
- start_date
- end_date
- status (Pending/Approved/Rejected/Completed)
- created_at

### Payments Table
- id (UUID)
- booking_id (Foreign Key - Unique)
- amount
- payment_method
- status
- created_at

## Authorization Rules

- Only Owners can create/update/delete their own properties
- Only Owners can approve/reject bookings for their properties
- Only Customers can create bookings
- Only Customers can record payments for their own bookings
- All users can view all properties

## Error Handling

All API endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "error": "Error details (if available)"
}
```

## CORS Configuration

Frontend and backend communicate across domains. CORS is enabled on backend for `http://localhost:3000`.

## Security Features

✅ Password hashing with bcryptjs (10 salt rounds)
✅ JWT authentication (24h expiration)
✅ Role-based access control
✅ Authorization middleware on protected routes
✅ SQL injection prevention with parameterized queries
✅ Soft delete for properties (data preservation)

## Troubleshooting

### MySQL Connection Error
- Check MySQL service is running
- Verify credentials in .env file
- Ensure database is created

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Use `PORT=3001 npm start`

### JWT Token Expired
- Token expires after 24 hours
- User needs to login again

### CORS Error
- Ensure backend is running on port 5000
- Check frontend .env has correct API URL

## Future Enhancements

- Email notifications
- Advanced search & filtering
- Review & rating system
- Cancellation policies
- Multi-currency support
- Stripe/PayPal integration
- Two-factor authentication
- Admin dashboard

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.

