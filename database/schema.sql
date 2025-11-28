CREATE DATABASE IF NOT EXISTS property_rental_db;
USE property_rental_db;

-- Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Owner', 'Customer') NOT NULL DEFAULT 'Customer',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Properties Table
CREATE TABLE properties (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    owner_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    location VARCHAR(255) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_bedrooms INT NOT NULL,
    total_bathrooms INT DEFAULT 0,
    total_guests INT DEFAULT 0,
    amenities LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_location (location)
);

-- Bookings Table
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    property_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    number_of_nights INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date)) STORED,
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_property_id (property_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    CONSTRAINT check_dates CHECK (start_date < end_date)
);

-- Payments Table
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer') NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    transaction_id VARCHAR(255),
    notes LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (payment_status),
    CONSTRAINT fk_unique_booking CHECK (booking_id IS NOT NULL)
);

-- Sample Data for Testing
INSERT INTO users (id, email, password, role, first_name, last_name) VALUES
('owner-001', 'owner@test.com', '$2b$10$xAx.aNdKxN8UHv2x7tZYn.u5Y5M7kR8pQvJq8kL4yM2Zq5K3oP8H.', 'Owner', 'John', 'Doe'),
('customer-001', 'customer@test.com', '$2b$10$xAx.aNdKxN8UHv2x7tZYn.u5Y5M7kR8pQvJq8kL4yM2Zq5K3oP8H.', 'Customer', 'Jane', 'Smith');

INSERT INTO properties (id, owner_id, name, description, location, price_per_night, total_bedrooms, total_bathrooms, total_guests) VALUES
('prop-001', 'owner-001', 'Luxury Beach Villa', 'Beautiful beachfront property with ocean views', 'Miami, Florida', 250.00, 4, 3, 8);

-- Indexes for Performance
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, start_date, end_date);
CREATE INDEX idx_payments_created ON payments(created_at);
CREATE INDEX idx_properties_owner_active ON properties(owner_id, is_active, deleted_at);
