#!/usr/bin/env node
/**
 * Setup script untuk Invest Bot Backend
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Invest Bot Backend - Setup');
console.log('=' * 40);

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json tidak ditemukan');
  console.log('💡 Pastikan Anda berada di folder backend');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies berhasil diinstall');
} catch (error) {
  console.log('❌ Gagal install dependencies');
  process.exit(1);
}

// Create uploads directory
console.log('\n📁 Creating uploads directory...');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
} else {
  console.log('✅ Uploads directory already exists');
}

// Create logs directory
console.log('\n📝 Creating logs directory...');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Logs directory created');
} else {
  console.log('✅ Logs directory already exists');
}

// Test configuration
console.log('\n🧪 Testing configuration...');
try {
  const config = require('../src/config');
  config.print();
  console.log('✅ Configuration loaded successfully');
} catch (error) {
  console.log('❌ Configuration error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set environment variables (optional):');
console.log('   - DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
console.log('   - TELEGRAM_BOT_TOKEN');
console.log('   - JWT_SECRET');
console.log('2. Make sure MySQL server is running');
console.log('3. Create database "invest_bot"');
console.log('4. Run: npm start (API) atau npm run bot (Bot)');
console.log('\n💡 Available commands:');
console.log('   npm start     - Start API server');
console.log('   npm run dev   - Start API with nodemon');
console.log('   npm run bot   - Start Telegram bot');
console.log('   npm run both  - Start both API and bot');
console.log('   npm run test  - Run tests');
