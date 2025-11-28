🏠 Property Rental Platform
A comprehensive full-stack web application for managing property rentals with user authentication, property management, booking system, and payment processing.
📋 Table of Contents

Features
Tech Stack
Architecture
Quick Start
Database Schema
API Documentation
Authorization & Security
Testing Guide
Troubleshooting


✨ Features
User Management

Role-Based Authentication: Owner and Customer roles
Secure Registration: Email verification and password hashing (bcryptjs)
JWT Authentication: 24-hour token expiration for security
Session Management: Automatic logout on token expiration

Property Management (Owners)

Create new rental properties
Edit property details (name, description, location, pricing)
Delete properties (soft delete preserves data)
View all listings and their bookings
Track booking approvals and rejections

Booking System (Customers)

Browse all available properties
View detailed property information
Create booking requests with date selection
Track booking status in real-time
Automatic date conflict detection

Booking Workflow
Pending → Approved/Rejected → (Approved) → Completed (after payment)
Payment Processing (Customers)

Record payments for approved bookings
Support multiple payment methods
Automatic booking completion after payment
Payment tracking and history

Administrative Features

View all bookings (cross-property)
View all payments
Role-based dashboard
User management


🛠 Tech Stack
Backend

Framework: Express.js 4.18+
Runtime: Node.js 14+
Database: MySQL 8.0+
Authentication: JWT + bcryptjs
Validation: Built-in Express middleware

Frontend

Library: React 18
Routing: React Router 6
State Management: Context API
HTTP Client: Axios/Fetch API
Styling: CSS3

Database

DBMS: MySQL 8.0+
Connection Pool: mysql2/promise
Query Language: SQL with parameterized queries


🏗 Architecture
Layered Architecture
┌─────────────────────────────────────┐
│     React Frontend (Port 3000)      │
│   - Pages, Components, Context      │
└────────────────┬────────────────────┘
                 │ (HTTP/REST)
┌────────────────▼────────────────────┐
│   Express Backend (Port 5000)       │
│  - Routes, Middleware, Controllers  │
└────────────────┬────────────────────┘
                 │ (MySQL Queries)
┌────────────────▼────────────────────┐
│    MySQL Database                   │
│  - Users, Properties, Bookings,     │
│    Payments, Indexes                │
└─────────────────────────────────────┘
Directory Structure
property-rental-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   └── auth.js               # JWT & role authorization
│   ├── routes/
│   │   ├── auth.js               # Registration & login
│   │   ├── properties.js          # Property CRUD
│   │   ├── bookings.js            # Booking management
│   │   └── payments.js            # Payment recording
│   ├── server.js                 # Express app setup
│   ├── .env                      # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── context/              # Auth context
│   │   ├── App.js                # Main app component
│   │   └── index.js              # React entry point
│   ├── public/
│   ├── .env                      # Frontend config
│   └── package.json
├── database/
│   └── schema.sql                # MySQL schema & sample data
└── README.md

🚀 Quick Start
Prerequisites
bash✓ Node.js v14+
✓ MySQL 8.0+
✓ npm or yarn
✓ Git
Installation (5 minutes)
1. Clone Repository
bashgit clone https://github.com/yourusername/property-rental-platform.git
cd property-rental-platform
2. Database Setup
bashmysql -u root -p < database/schema.sql
3. Backend Setup
bashcd backend
npm install
cp .env.example .env
npm run dev
# Server runs on http://localhost:5000
4. Frontend Setup (New terminal)
bashcd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
5. Access Application

Open browser: http://localhost:3000
Use test credentials (see below)


🧪 Test Credentials
Owner Account
Email:    owner@test.com
Password: password123
Role:     Owner
Customer Account
Email:    customer@test.com
Password: password123
Role:     Customer
Test Data

Sample Property: "Luxury Beach Villa" in Miami, Florida
Price: $250/night
Bedrooms: 4


💾 Database Schema
Tables Overview
users

id (UUID, Primary Key)
email (String, Unique)
password (Hashed)
role (Owner | Customer)
first_name, last_name
created_at, updated_at

properties

id (UUID, Primary Key)
owner_id (Foreign Key → users)
name, description, location
price_per_night (Decimal)
total_bedrooms, total_bathrooms, total_guests
is_active (Boolean)
deleted_at (Soft Delete)
created_at, updated_at

bookings

id (UUID, Primary Key)
customer_id (Foreign Key → users)
property_id (Foreign Key → properties)
start_date, end_date (Date)
status (Pending | Approved | Rejected | Completed)
total_price (Decimal)
number_of_nights (Computed)
created_at, updated_at

payments

id (UUID, Primary Key)
booking_id (Foreign Key → bookings, Unique)
amount (Decimal)
payment_method (Enum)
payment_status (Pending | Completed | Failed)
transaction_id, notes
created_at, updated_at

ER Diagram
┌─────────────┐
│    USERS    │
└──────┬──────┘
       │ 1
       │ ├──→ many ┌──────────────┐
       │           │ PROPERTIES   │
       │ ├──→ many │              │
       └───────────┼──────────────┘
                   │ 1
                   │
              many ├──→ ┌───────────────┐
                        │   BOOKINGS    │
                        │               │
                        └───────┬───────┘
                                │ 1
                                │
                           1←───┤
                                │ many
                            ┌───┴───────┐
                            │ PAYMENTS  │
                            └───────────┘

🔌 API Documentation
Authentication
Register User
httpPOST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "Customer",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "message": "User registered successfully",
  "userId": "uuid-here"
}
Login User
httpPOST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "Owner"
  }
}
Properties (CRUD)
Get All Properties
httpGET /api/properties

Response (200):
[
  {
    "id": "prop-001",
    "owner_id": "owner-001",
    "name": "Luxury Beach Villa",
    "location": "Miami, Florida",
    "price_per_night": 250.00,
    "total_bedrooms": 4
  }
]
Get Single Property
httpGET /api/properties/:id

Response (200):
{
  "id": "prop-001",
  "name": "Luxury Beach Villa",
  ...
}
Create Property (Owner only)
httpPOST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mountain Cabin",
  "description": "Cozy mountain retreat",
  "location": "Aspen, Colorado",
  "pricePerNight": 180.00,
  "totalBedrooms": 3,
  "totalBathrooms": 2
}

Response (201):
{
  "message": "Property created",
  "propertyId": "new-uuid"
}
Update Property (Owner, own property)
httpPUT /api/properties/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "pricePerNight": 200.00
}

Response (200):
{
  "message": "Property updated successfully"
}
Delete Property (Owner, soft delete)
httpDELETE /api/properties/:id
Authorization: Bearer {token}

Response (200):
{
  "message": "Property deleted successfully"
}
Bookings
Create Booking (Customer only)
httpPOST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "propertyId": "prop-001",
  "startDate": "2024-12-20",
  "endDate": "2024-12-25"
}

Response (201):
{
  "message": "Booking created",
  "bookingId": "booking-001",
  "totalPrice": 1250.00
}
Update Booking Status (Owner, own property)
httpPATCH /api/bookings/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Approved"
}

Response (200):
{
  "message": "Booking approved"
}
Payments
Record Payment (Customer, own booking)
httpPOST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking-001",
  "amount": 1250.00,
  "paymentMethod": "Credit Card",
  "transactionId": "txn_12345"
}

Response (201):
{
  "message": "Payment recorded and booking completed",
  "paymentId": "payment-001"
}

🔐 Authorization & Security
Role-Based Access Control (RBAC)
ActionOwnerCustomerGuestView Properties✅✅✅Create Property✅❌❌Edit Own Property✅❌❌Delete Property✅❌❌Create Booking❌✅❌Approve Booking✅*❌❌Record Payment❌✅*❌View Bookings✅✅❌
* Only for their own resources
Security Features
Password Security

bcryptjs hashing with 10 salt rounds
No plain text password storage
Password validation on registration

Authentication

JWT (JSON Web Token) implementation
24-hour token expiration
Automatic logout on expiration
Token stored in localStorage

Authorization

Middleware-based access control
Role validation on protected routes
Ownership verification for resource updates
Cascading delete prevention

Database Security

Parameterized queries (SQL injection prevention)
Connection pooling
Unique constraints on email
Foreign key relationships enforced

Data Protection

Soft delete for properties (data preservation)
Immutable payment records
Audit trail via timestamps
UUID for resource identifiers


🧪 Testing Guide
Test Scenario 1: Owner Creates Property

Login as owner@test.com
Navigate to Dashboard
Click "Create Property"
Fill details:

Name: "Beachfront Condo"
Location: "Santa Monica, California"
Price: $300/night
Bedrooms: 3


Submit
Verify property appears in list

Test Scenario 2: Customer Books Property

Login as customer@test.com
Browse properties
Click on "Beachfront Condo"
Select dates:

Check-in: 2024-12-20
Check-out: 2024-12-25


Click "Book Property"
Verify booking created with "Pending" status

Test Scenario 3: Owner Approves Booking

Logout customer account
Login as owner@test.com
View bookings
Find pending booking from customer
Click "Approve"
Verify status changes to "Approved"

Test Scenario 4: Customer Records Payment

Logout owner account
Login as customer@test.com
View bookings
Find approved booking
Click "Record Payment"
Fill payment details:

Amount: $1500 (5 nights × $300)
Method: Credit Card


Submit
Verify booking transitions to "Completed"

Test Scenario 5: Authorization Tests
Owner cannot create booking

Login as owner@test.com
Try to create booking → Should show "Only customers can book"

Customer cannot approve booking

Login as customer@test.com
Try to approve booking → Should show "Insufficient permissions"

Customer cannot delete property

Login as customer@test.com
Try to delete property → Should show "Not authorized"


🐛 Troubleshooting
Backend Issues
Error: "Connection refused" on startup
bash# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Start MySQL if needed
# macOS: brew services start mysql
# Windows: net start MySQL80
# Linux: sudo service mysql start
Error: "Cannot find module"
bashcd backend
rm -rf node_modules package-lock.json
npm install
Error: "EADDRINUSE: address already in use :::5000"
bash# Port 5000 is in use. Kill process:
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
Frontend Issues
Error: "CORS error" in console

Verify backend is running on http://localhost:5000
Check frontend .env: REACT_APP_API_URL=http://localhost:5000/api
Restart frontend: npm start

Error: "Cannot POST /api/auth/login"

Backend routes not loaded correctly
Check server.js has all route imports
Verify Express app middleware order

Blank page after login

Check browser console for errors
Verify token is being saved in localStorage
Clear localStorage and retry: localStorage.clear()

Database Issues
Error: "Unknown database 'property_rental_db'"
bashmysql -u root -p < database/schema.sql
# Verify: mysql -u root -p property_rental_db -e "SHOW TABLES;"
Error: "Access denied for user 'root'"

Check MySQL password in .env
Verify MySQL user exists: mysql -u root -p

Error: "Booking not updating to Completed"

Verify payments.js updates booking status
Check query syntax in UPDATE statement
Test query manually in MySQL

Token Issues
"Token expired" or "Unauthorized" after login

Token is valid for 24 hours
Clear localStorage and login again
Check JWT_SECRET in backend .env

Token not persisting after page refresh

Frontend should save token to localStorage
Verify AuthContext.js loads token on mount
Check browser localStorage permissions


📊 Performance Optimization
Database Indexes

Email index on users table (fast login)
Owner_id index on properties (quick ownership lookup)
Booking dates index (fast date conflict detection)
Status index on bookings (quick status filtering)

Query Optimization

Parameterized queries prevent SQL injection
Connection pooling reduces connection overhead
Lazy loading of property lists
Pagination ready (not implemented yet)


📝 License
MIT License - Free to use, modify, and distribute

🤝 Contributing
Contributions welcome! Please:

Fork the repository
Create feature branch: git checkout -b feature/your-feature
Commit changes: git commit -m 'Add feature'
Push to branch: git push origin feature/your-feature
Open Pull Request


📧 Support
For issues, questions, or suggestions:

Create an issue in the repository
Check existing issues for solutions
Review troubleshooting section
Check database schema for relationships
