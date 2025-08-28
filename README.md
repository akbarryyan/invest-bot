# Invest Bot - Bot Telegram Investasi

Bot Telegram investasi dengan sistem paket investasi, claim harian, referral, dan admin dashboard.

## Fitur Utama

### Bot Telegram
- ✅ Sistem autentikasi user (login/register)
- ✅ Lihat paket investasi tanpa login
- ✅ Pembelian paket investasi
- ✅ Claim harian otomatis
- ✅ Sistem referral dengan bonus
- ✅ Dashboard user lengkap
- ✅ Anti-spam claim harian
- ✅ Reminder otomatis harian

### Admin Dashboard
- ✅ Dashboard monitoring real-time
- ✅ CRUD paket investasi
- ✅ Manajemen user dan saldo
- ✅ Monitoring transaksi
- ✅ Analytics dan reporting
- ✅ Interface modern dengan React + Tailwind CSS

## Tech Stack

### Backend
- **Python 3.8+** - Logic utama bot dan API
- **python-telegram-bot** - Bot Telegram framework
- **FastAPI** - REST API untuk admin dashboard
- **SQLAlchemy** - ORM database
- **MySQL** - Database utama
- **APScheduler** - Task scheduling (reminder, reset claim)

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Heroicons** - Icon set

## Struktur Project

```
invest_bot/
├── backend/                      # Backend API & Bot Telegram
│   ├── bot/                      # Bot Telegram
│   │   ├── main.py               # Entry point bot
│   │   ├── handlers/             # Handler per fitur bot
│   │   ├── jobs/                 # Task APScheduler
│   │   └── utils/                # Helper functions
│   ├── api/                      # REST API untuk admin dashboard
│   │   ├── main.py               # Entry point API
│   │   ├── routes/               # Endpoint API
│   │   └── models/               # Model ORM
│   ├── config.py                 # Konfigurasi aplikasi
│   └── requirements.txt          # Dependencies Python
├── frontend/                     # Admin Dashboard
│   ├── src/
│   │   ├── components/           # Komponen React
│   │   ├── pages/                # Halaman admin
│   │   └── App.tsx               # App utama
│   └── package.json              # Dependencies Node.js
└── README.md                     # Dokumentasi ini
```

## Instalasi & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Bot Token Telegram

### Backend Setup
1. Buat virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Setup environment variables:
```bash
cp env_example.txt .env
# Edit .env dengan konfigurasi yang sesuai
```

4. Setup database:
```bash
# Buat database MySQL
mysql -u root -p
CREATE DATABASE invest_bot_db;
```

5. Jalankan bot:
```bash
python bot/main.py
```

6. Jalankan API (terminal terpisah):
```bash
python api/main.py
```

### Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser ke `http://localhost:5173`

## Konfigurasi

### Environment Variables
- `TELEGRAM_BOT_TOKEN` - Token bot Telegram dari @BotFather
- `DB_HOST` - Host database MySQL
- `DB_NAME` - Nama database
- `DB_USER` - Username database
- `DB_PASSWORD` - Password database
- `JWT_SECRET_KEY` - Secret key untuk JWT

### Database Schema
- **users** - Data user Telegram
- **packages** - Paket investasi
- **transactions** - Riwayat transaksi
- **referrals** - Data referral

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout admin

### Packages
- `GET /api/packages` - List semua paket
- `POST /api/packages` - Tambah paket baru
- `PUT /api/packages/{id}` - Update paket
- `DELETE /api/packages/{id}` - Hapus paket

### Users
- `GET /api/users` - List semua user
- `GET /api/users/{id}` - Detail user
- `PUT /api/users/{id}` - Update user

### Transactions
- `GET /api/transactions` - List transaksi
- `GET /api/transactions/{id}` - Detail transaksi

## Bot Commands

- `/start` - Mulai bot dan daftar/login
- Menu utama dengan fitur lengkap

## Contributing

1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

Untuk dukungan teknis, silakan buat issue di repository ini atau hubungi tim development.
