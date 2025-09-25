-- Database Setup for Inventory Control System

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 2. Create Suppliers Table
CREATE TABLE IF NOT EXISTS Suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS Products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT REFERENCES Categories(category_id)
);

-- 4. Create Users Table (for authentication)
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insert Sample Categories
INSERT INTO Categories (name, description) VALUES 
('Electronics', 'Electronic devices and accessories'),
('Furniture', 'Office and home furniture'),
('Stationery', 'Office supplies and stationery items'),
('Food & Beverages', 'Food items and drinks')
ON CONFLICT DO NOTHING;

-- 6. Insert Sample Suppliers
INSERT INTO Suppliers (name, contact_email, contact_phone, address) VALUES 
('TechCorp Ltd', 'contact@techcorp.com', '+1-555-0101', '123 Tech Street, Silicon Valley'),
('Furniture Plus', 'info@furnitureplus.com', '+1-555-0102', '456 Furniture Ave, Design City'),
('Office Supplies Co', 'sales@officesupplies.com', '+1-555-0103', '789 Supply Road, Business District'),
('Fresh Foods Inc', 'orders@freshfoods.com', '+1-555-0104', '321 Fresh Lane, Food Valley')
ON CONFLICT DO NOTHING;

-- 7. Insert Sample Products
INSERT INTO Products (name, description, price, stock_quantity, category_id) VALUES 
('Laptop Computer', 'High-performance laptop for business use', 999.99, 25, 1),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 150, 1),
('Office Chair', 'Comfortable ergonomic office chair', 199.99, 30, 2),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 49.99, 75, 2),
('Notebook Set', 'Pack of 5 professional notebooks', 15.99, 200, 3),
('Pen Pack', 'Pack of 10 ballpoint pens', 8.99, 300, 3),
('Coffee Beans', 'Premium arabica coffee beans 1kg', 24.99, 50, 4),
('Water Bottles', 'Reusable water bottles pack of 6', 19.99, 100, 4),
('Monitor Stand', 'Adjustable monitor stand', 79.99, 5, 1),
('Printer Paper', 'A4 printer paper 500 sheets', 12.99, 8, 3)
ON CONFLICT DO NOTHING;