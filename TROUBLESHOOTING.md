# 🔧 Troubleshooting Guide - Invest Bot

Panduan mengatasi masalah umum saat setup dan menjalankan Invest Bot.

## 🚨 Common Installation Errors

### 1. mysqlclient Build Error
**Error:** `fatal error C1083: Cannot open include file: 'mysql.h'`

**Solution:**
```bash
# Gunakan pymysql sebagai gantinya
pip install pymysql

# Atau gunakan requirements_windows.txt
pip install -r requirements_windows.txt
```

### 2. Visual Studio Build Tools Missing
**Error:** `cl.exe failed with exit code 2`

**Solution:**
- Install Visual Studio Build Tools 2019/2022
- Atau gunakan pre-compiled wheels:
```bash
pip install --only-binary=all mysqlclient
```

### 3. Python Version Compatibility
**Error:** Package compatibility issues

**Solution:**
- Use Python 3.8-3.11 (more stable)
- Update pip: `python -m pip install --upgrade pip`
- Use compatible package versions

## 🗄️ Database Connection Issues

### 1. MySQL Connection Failed
**Error:** `Can't connect to MySQL server`

**Solution:**
```bash
# Pastikan MySQL berjalan
net start mysql80

# Cek credentials di .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=invest_bot_db
```

### 2. Database Not Found
**Error:** `Unknown database 'invest_bot_db'`

**Solution:**
```sql
-- Buat database
CREATE DATABASE invest_bot_db;
USE invest_bot_db;

-- Import schema
source backend/database_schema.sql;
```

### 3. Access Denied
**Error:** `Access denied for user 'root'@'localhost'`

**Solution:**
```sql
-- Reset MySQL root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

## 🤖 Bot Telegram Issues

### 1. Bot Not Responding
**Error:** Bot tidak merespon command

**Solution:**
- Cek `TELEGRAM_BOT_TOKEN` di `.env`
- Pastikan bot tidak di-block user
- Cek log di terminal
- Restart bot: `python start_bot.py`

### 2. Webhook Error
**Error:** Webhook setup failed

**Solution:**
- Gunakan polling mode (default)
- Atau setup webhook dengan domain HTTPS
- Cek firewall settings

### 3. Rate Limiting
**Error:** Too many requests

**Solution:**
- Bot memiliki built-in rate limiting
- Tunggu beberapa menit
- Cek `security.py` untuk konfigurasi

## 🌐 Frontend Issues

### 1. Frontend Can't Connect to API
**Error:** `Failed to fetch from API`

**Solution:**
- Pastikan backend API berjalan di port 8000
- Cek CORS settings di `api/main.py`
- Pastikan tidak ada firewall blocking
- Cek browser console untuk error details

### 2. Build Errors
**Error:** `Module not found` atau build failed

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (16+ recommended)
node --version
```

### 3. Port Already in Use
**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill process using port
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Atau gunakan port lain
npm run dev -- --port 3000
```

## 🔧 System Requirements

### Windows
- **OS:** Windows 10/11 (64-bit)
- **Python:** 3.8-3.11 (recommended)
- **Node.js:** 16+ (LTS recommended)
- **MySQL:** 8.0+
- **RAM:** 4GB+ (8GB recommended)
- **Disk:** 2GB free space

### Dependencies
```bash
# Python packages
pip install -r requirements_windows.txt

# Node.js packages
npm install

# System tools
# - Visual Studio Build Tools (if needed)
# - MySQL Server
# - Git (optional)
```

## 🚀 Quick Fix Commands

### Reset Everything
```bash
# Clean Python
pip uninstall -r requirements.txt -y
pip cache purge

# Clean Node.js
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstall
pip install -r requirements_windows.txt
npm install
```

### Database Reset
```sql
-- Drop and recreate database
DROP DATABASE IF EXISTS invest_bot_db;
CREATE DATABASE invest_bot_db;
USE invest_bot_db;
source backend/database_schema.sql;
```

### Environment Reset
```bash
# Copy fresh environment file
cp backend/env_example.txt backend/.env

# Edit .env with your settings
notepad backend/.env
```

## 📞 Getting Help

### 1. Check Logs
```bash
# Backend logs
tail -f backend/bot.log
tail -f backend/api.log

# Frontend logs
# Check browser console
```

### 2. Common Issues
- **Port conflicts:** Use different ports
- **Permission denied:** Run as administrator
- **Path issues:** Use absolute paths
- **Encoding issues:** Use UTF-8

### 3. Support Resources
- 📖 README.md - Main documentation
- 🚀 QUICK_START.md - Quick setup guide
- 🐛 GitHub Issues - Bug reports
- 💬 Development team - Direct support

---

**Remember:** Most issues can be solved by following the troubleshooting steps above. If problems persist, check the logs and provide detailed error messages when seeking help.
