# 🚀 Quick Start Guide - Invest Bot

Panduan cepat untuk menjalankan Invest Bot Telegram dengan admin dashboard.

## ⚡ Quick Start (5 Menit)

### 1. Prerequisites
- ✅ Python 3.8+
- ✅ Node.js 16+
- ✅ MySQL 8.0+
- ✅ Bot Token dari @BotFather

### 2. Setup Database
```bash
# Buat database
mysql -u root -p
CREATE DATABASE invest_bot_db;
USE invest_bot_db;

# Import schema
mysql -u root -p invest_bot_db < backend/database_schema.sql
```

### 3. Setup Environment
```bash
# Copy environment file
cp backend/env_example.txt backend/.env

# Edit .env dengan konfigurasi yang sesuai
# TELEGRAM_BOT_TOKEN=your_bot_token_here
# DB_PASSWORD=your_db_password
```

### 4. Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 5. Run Services
```bash
# Terminal 1: Backend API
cd backend
python start_api.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Bot Telegram
cd backend
python start_bot.py
```

### 6. Access Services
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **API**: http://localhost:8000
- 🤖 **Bot**: Cari username bot Anda di Telegram

## 🎯 Fitur yang Tersedia

### Bot Telegram
- ✅ `/start` - Mulai bot dan daftar
- ✅ Lihat paket investasi
- ✅ Beli paket (simulasi)
- ✅ Dashboard user
- ✅ Sistem referral

### Admin Dashboard
- ✅ Dashboard monitoring
- ✅ CRUD paket investasi
- ✅ Manajemen user
- ✅ Monitoring transaksi

## 🔧 Troubleshooting

### Bot tidak merespon
- Cek `TELEGRAM_BOT_TOKEN` di `.env`
- Pastikan bot tidak di-block user
- Cek log di terminal

### Database connection error
- Pastikan MySQL berjalan
- Cek credentials di `.env`
- Pastikan database `invest_bot_db` sudah dibuat

### Frontend tidak bisa akses API
- Pastikan backend API berjalan di port 8000
- Cek CORS settings
- Pastikan tidak ada firewall blocking

## 📱 Test Bot

1. **Daftar User Baru**
   - Kirim `/start` ke bot
   - Klik "Daftar Sekarang"
   - Dapatkan referral code

2. **Lihat Paket**
   - Klik "📦 Paket Investasi"
   - Lihat daftar paket tersedia

3. **Admin Dashboard**
   - Buka http://localhost:5173
   - Login dengan admin/admin123
   - Lihat dashboard monitoring

## 🚀 Production Deployment

### Docker (Recommended)
```bash
# Build dan run
docker-compose up -d

# Cek status
docker-compose ps

# Lihat logs
docker-compose logs -f
```

### Manual Deployment
1. Setup production database
2. Update environment variables
3. Setup reverse proxy (Nginx)
4. Setup SSL certificate
5. Run dengan process manager (PM2/systemd)

## 📚 Next Steps

1. **Customize Bot**
   - Update welcome message
   - Tambah fitur baru
   - Customize UI

2. **Enhance Security**
   - Setup rate limiting
   - Add admin authentication
   - Implement audit logging

3. **Monitoring**
   - Setup logging
   - Add metrics
   - Setup alerts

4. **Scale**
   - Add Redis caching
   - Implement load balancing
   - Setup backup strategy

## 🆘 Need Help?

- 📖 Baca dokumentasi lengkap di `README.md`
- 🐛 Buat issue di repository
- 💬 Hubungi tim development

---

**Happy Coding! 🎉**
