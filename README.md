Property Rental Platform
A full-stack web application for managing property rentals with secure user authentication, role-based access control, and complete booking workflow management.

🚀 Features
Authentication & Security
Secure Registration & Login with bcrypt password hashing

JWT-based Authentication with 7-day token expiration

Role-Based Access Control (Owner & Customer roles)

Protected API Endpoints with authorization middleware

Property Management
Owners can create, update, and delete their properties

All authenticated users can view all listed properties

Property details include title, description, location, and price per night

Booking System
Customers can request bookings by selecting rental dates

Booking Status Workflow: Pending → Approved → Rejected → Completed

Only property owners can approve or reject booking requests

Automatic total price calculation based on nights and property price

Payment Processing
Customers can record payments for approved bookings

Multiple payment methods supported (Credit Card, Debit Card, PayPal, Bank Transfer)

Booking auto-completion after successful payment recording

Payment history tracking for customers

🛠️ Tech Stack
Backend
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL with Sequelize ORM

Authentication: JWT + bcryptjs

Security: CORS, environment variables

Frontend
Framework: React with React Router

HTTP Client: Axios with interceptors

State Management: React Hooks

Styling: CSS3

🗄️ Database Schema
Entities & Relationships
text
Users (1) → (N) Properties
Users (1) → (N) Bookings (as Customer)
Properties (1) → (N) Bookings
Bookings (1) → (1) Payments
Tables Structure
Users: id, email, password, name, role, createdAt, updatedAt

Properties: id, ownerId, title, description, location, pricePerNight, availability, timestamps

Bookings: id, propertyId, customerId, checkInDate, checkOutDate, status, totalPrice, timestamps

Payments: id, bookingId, amount, paymentMethod, status, timestamps

📦 Installation
Prerequisites
Node.js (v14 or higher)

PostgreSQL (v12 or higher)

npm or yarn

Backend Setup
bash
# Clone repository
git clone <repository-url>
cd property-rental-platform/backend

# Install dependencies
npm install

# Environment configuration
cp .env.example .env
# Edit .env with your database credentials

# Database setup
npm run db:create
npm run db:migrate

# Start development server
npm run dev
Frontend Setup
bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
🔧 Configuration
Environment Variables
Backend (.env)

env
DATABASE_URL=postgresql://username:password@localhost:5432/property_rental_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
🎯 Usage
User Registration & Roles
Register with email, password, name, and role (Owner/Customer)

Login to receive JWT token

Automatic routing to appropriate dashboard based on role

Property Owner Flow
Create Properties: Add property details, location, and pricing

Manage Bookings: View, approve, or reject booking requests

Track Payments: Monitor payment status for approved bookings

Customer Flow
Browse Properties: View all available rental properties

Request Bookings: Select dates and submit booking requests

Make Payments: Record payments for approved bookings

View History: Track booking and payment status

📡 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

Properties
GET /api/properties - Get all properties (public)

POST /api/properties - Create property (Owner only)

PUT /api/properties/:id - Update property (Owner only)

DELETE /api/properties/:id - Delete property (Owner only)

Bookings
POST /api/bookings - Request booking (Customer only)

PATCH /api/bookings/:id/approve - Approve booking (Owner only)

PATCH /api/bookings/:id/reject - Reject booking (Owner only)

GET /api/bookings/customer/list - Get customer bookings

GET /api/bookings/owner/list - Get owner's property bookings

Payments
POST /api/payments - Record payment (Customer only)

GET /api/payments - Get payment history (Customer only)

🔒 Authorization Rules
Role-Based Access
Owners: Create/update/delete own properties, approve/reject bookings for own properties

Customers: Request bookings, make payments, view own booking/payment history

Shared: View all properties

Data Protection
Users can only modify their own properties

Owners can only manage bookings for their properties

Customers can only access their own bookings and payments

📋 Assumptions
Password Security: Minimum 6 characters, bcrypt hashing with salt rounds 10

Booking Validation: Check-out date must be after check-in date

Payment Processing: Simulated payment flow (no real payment gateway)

Date Handling: ISO 8601 format for all dates

Price Calculation: Total = pricePerNight × number of nights

Status Flow: Strict workflow enforcement (Pending→Approved→Completed)

🧪 Sample Test Data
Test Credentials
text
Owner Account:
Email: owner@example.com
Password: password123
Role: Owner

Customer Account:
Email: customer@example.com
Password: password123
Role: Customer
Sample Properties
Beach House, Miami, FL - $150/night

Mountain Cabin, Aspen, CO - $120/night

City Apartment, New York, NY - $200/night

🚀 Deployment
Production Build
bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve built files with nginx or similar
Environment Setup
Set NODE_ENV=production

Configure production database

Update CORS settings for production domain

Set strong JWT secret

📁 Project Structure
text
property-rental-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── pages/       # React components
│   │   ├── services/    # API calls
│   │   └── styles/      # CSS files
│   └── public/
└── README.md
🔮 Future Enhancements
Email notifications for booking status changes

Advanced property search and filtering

Review and rating system

Image upload for properties

Calendar-based availability management

Real-time messaging between owners and customers

Admin dashboard for platform management

📞 Support
For technical support or questions about this implementation, please refer to the source code documentation or create an issue in the project repository.
