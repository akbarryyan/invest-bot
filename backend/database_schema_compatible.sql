-- Invest Bot Database Schema
-- MySQL 5.7+ Compatible (More compatible version)

-- Create database
CREATE DATABASE IF NOT EXISTS invest_bot_db;
USE invest_bot_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    referred_by VARCHAR(10),
    referral_bonus DECIMAL(15,2) DEFAULT 0.00,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_telegram_id (telegram_id),
    INDEX idx_referral_code (referral_code),
    INDEX idx_referred_by (referred_by)
);

-- Packages table
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    duration_days INT NOT NULL,
    daily_return DECIMAL(5,2) NOT NULL,
    image_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_is_active (is_active),
    INDEX idx_price (price)
);

-- User Packages (Active investments)
CREATE TABLE user_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME NOT NULL,
    daily_return_amount DECIMAL(15,2) NOT NULL,
    total_return_earned DECIMAL(15,2) DEFAULT 0.00,
    is_active TINYINT(1) DEFAULT 1,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_package_id (package_id),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_is_active (is_active)
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT,
    transaction_type ENUM('purchase', 'claim', 'deposit', 'withdraw', 'referral', 'bonus') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Referrals table
CREATE TABLE referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id INT NOT NULL,
    referred_id INT NOT NULL,
    bonus_amount DECIMAL(15,2) DEFAULT 0.00,
    is_paid TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_referral (referrer_id, referred_id),
    INDEX idx_referrer_id (referrer_id),
    INDEX idx_referred_id (referred_id)
);

-- Daily Claims table (Anti-spam)
CREATE TABLE daily_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    claim_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_daily_claim (user_id, package_id, claim_date),
    INDEX idx_user_id (user_id),
    INDEX idx_claim_date (claim_date)
);

-- Admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_is_active (is_active)
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq6Hy', 'admin@investbot.com');

-- Insert sample packages
INSERT INTO packages (name, description, price, duration_days, daily_return, image_url) VALUES
('Paket Starter', 'Paket investasi untuk pemula dengan return harian yang stabil', 100000.00, 30, 2.50, 'https://example.com/starter.jpg'),
('Paket Silver', 'Paket investasi menengah dengan return harian yang menarik', 500000.00, 60, 3.00, 'https://example.com/silver.jpg'),
('Paket Gold', 'Paket investasi premium dengan return harian tinggi', 1000000.00, 90, 3.50, 'https://example.com/gold.jpg'),
('Paket Platinum', 'Paket investasi VIP dengan return harian maksimal', 5000000.00, 120, 4.00, 'https://example.com/platinum.jpg');

-- Create views for easier querying
CREATE VIEW active_investments AS
SELECT 
    up.id,
    u.telegram_id,
    u.username,
    u.first_name,
    p.name as package_name,
    p.daily_return,
    up.daily_return_amount,
    up.total_return_earned,
    up.purchase_date,
    up.expiry_date,
    DATEDIFF(up.expiry_date, CURDATE()) as days_remaining
FROM user_packages up
JOIN users u ON up.user_id = u.id
JOIN packages p ON up.package_id = p.id
WHERE up.is_active = 1 AND up.expiry_date > NOW();

CREATE VIEW daily_claim_summary AS
SELECT 
    DATE(created_at) as claim_date,
    COUNT(*) as total_claims,
    SUM(amount) as total_amount
FROM transactions 
WHERE transaction_type = 'claim' 
GROUP BY DATE(created_at)
ORDER BY claim_date DESC;

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, transaction_type, created_at);
CREATE INDEX idx_user_packages_user_active ON user_packages(user_id, is_active);
CREATE INDEX idx_daily_claims_user_date ON daily_claims(user_id, claim_date);
