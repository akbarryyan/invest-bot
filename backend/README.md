# 🚀 Invest Bot Backend

Backend API dan Telegram Bot untuk sistem investasi menggunakan Node.js, Express, dan MySQL.

## ✨ Fitur

- **Telegram Bot** - Bot interaktif dengan command lengkap
- **REST API** - API untuk admin dashboard
- **Database MySQL** - Menggunakan Sequelize ORM
- **Authentication** - JWT-based authentication
- **File Upload** - Upload gambar untuk paket investasi
- **Rate Limiting** - Anti-spam protection
- **Scheduled Jobs** - Cron jobs untuk reminder dan reset

## 🛠️ Tech Stack

- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** MySQL dengan Sequelize ORM
- **Bot:** node-telegram-bot-api
- **Authentication:** JWT
- **File Upload:** Multer + Sharp
- **Scheduler:** node-cron
- **Security:** Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 16+ dan npm
- MySQL Server 8.0+
- Telegram Bot Token

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment (Optional)
```bash
# Set environment variables (optional)
export DB_HOST=localhost
export DB_NAME=invest_bot
export DB_USER=root
export DB_PASSWORD=your_password
export TELEGRAM_BOT_TOKEN=your_bot_token
export JWT_SECRET=your_secret_key
```

### 3. Setup Database
```bash
# Buat database MySQL
mysql -u root -p
CREATE DATABASE invest_bot;
```

### 4. Run Setup Script
```bash
npm run setup
```

### 5. Start Services

#### Start API Server
```bash
npm start          # Production
npm run dev        # Development (with nodemon)
```

#### Start Telegram Bot
```bash
npm run bot
```

#### Start Both (API + Bot)
```bash
npm run both
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── database/         # Database connection & models
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── bot/              # Telegram bot
│   └── server.js         # Main server file
├── scripts/              # Setup and utility scripts
├── uploads/              # File uploads
├── logs/                 # Application logs
├── package.json          # Dependencies & scripts
└── README.md            # This file
```

## 🔧 Configuration

Backend menggunakan environment variables dengan default values:

```javascript
// Server
PORT=8000
HOST=0.0.0.0
NODE_ENV=development

// Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=invest_bot
DB_USER=root
DB_PASSWORD=

// Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=
TELEGRAM_POLLING=true

// JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Admin user management
- `GET /api/admin/packages` - Admin package management

## 🤖 Bot Commands

- `/start` - Mulai bot dan lihat menu utama
- `/help` - Bantuan dan daftar perintah
- `/packages` - Lihat paket investasi yang tersedia
- `/portfolio` - Lihat portfolio investasi Anda
- `/balance` - Cek saldo akun
- `/claim` - Claim return harian
- `/referral` - Sistem referral dan bonus
- `/profile` - Profil pengguna

## 📊 Database Models

### User
- Basic info (name, email, phone)
- Balance dan referral system
- Telegram integration

### Package
- Investment package details
- Price, duration, return rates
- Image dan status

### Transaction
- Investment transactions
- Claim records
- Referral bonuses

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - Anti-spam protection
- **JWT Authentication** - Secure API access
- **Input Validation** - Request validation
- **SQL Injection Protection** - Sequelize ORM

## 📝 Logging

- **Morgan** - HTTP request logging
- **File Logging** - Application logs to files
- **Error Logging** - Global error handling

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🚀 Deployment

### Production
```bash
NODE_ENV=production npm start
```

### Docker (Optional)
```bash
docker build -t invest-bot-backend .
docker run -p 8000:8000 invest-bot-backend
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Bot Documentation](./docs/BOT.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see [LICENSE](../LICENSE) file

## 🆘 Support

- **Issues:** GitHub Issues
- **Documentation:** README files
- **Admin:** @admin_username

---

**Happy Coding! 🚀**
