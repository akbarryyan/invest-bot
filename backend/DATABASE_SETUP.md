# Database Setup Guide

## Overview
Terdapat 2 file schema database yang dapat digunakan sesuai dengan versi MySQL yang Anda gunakan:

### 1. `database_schema.sql` (MySQL 8.0+)
- Menggunakan `BOOLEAN` type (alias untuk `TINYINT(1)`)
- Menggunakan `DATETIME` untuk `expiry_date`
- Kompatibel dengan MySQL 8.0 dan versi terbaru

### 2. `database_schema_compatible.sql` (MySQL 5.7+)
- Menggunakan `TINYINT(1)` untuk boolean fields
- Menggunakan `DATETIME` untuk `expiry_date`
- Lebih kompatibel dengan berbagai versi MySQL

## Cara Memilih Schema yang Tepat

### Gunakan `database_schema.sql` jika:
- MySQL versi 8.0 atau lebih baru
- Tidak ada masalah dengan `BOOLEAN` type
- Ingin menggunakan fitur MySQL terbaru

### Gunakan `database_schema_compatible.sql` jika:
- MySQL versi 5.7 atau lebih lama
- Mengalami error dengan `BOOLEAN` type
- Ingin kompatibilitas maksimal

## Error yang Sering Terjadi

### Error #1067 - Invalid default value for 'expiry_date'
**Penyebab:** Kolom `TIMESTAMP` tidak bisa memiliki default value yang valid di beberapa konfigurasi MySQL.

**Solusi:** 
1. Gunakan `database_schema_compatible.sql`
2. Atau ubah `expiry_date` dari `TIMESTAMP` ke `DATETIME`

### Error dengan BOOLEAN type
**Penyebab:** Beberapa versi MySQL tidak mendukung `BOOLEAN` type.

**Solusi:** Gunakan `database_schema_compatible.sql` yang menggunakan `TINYINT(1)`

## Langkah Setup Database

### 1. Pilih Schema File
```bash
# Untuk MySQL 8.0+
cp database_schema.sql schema_to_use.sql

# Untuk MySQL 5.7+ atau kompatibilitas maksimal
cp database_schema_compatible.sql schema_to_use.sql
```

### 2. Import ke phpMyAdmin
1. Buka phpMyAdmin
2. Pilih database atau buat database baru
3. Klik tab "SQL"
4. Copy dan paste isi file schema yang dipilih
5. Klik "Go" untuk menjalankan query

### 3. Verifikasi Setup
Setelah import berhasil, Anda akan melihat:
- 7 tabel: `users`, `packages`, `user_packages`, `transactions`, `referrals`, `daily_claims`, `admin_users`
- 2 views: `active_investments`, `daily_claim_summary`
- Data sample: 1 admin user dan 4 paket investasi

## Troubleshooting

### Jika masih error dengan expiry_date:
```sql
-- Coba query ini untuk membuat tabel user_packages secara manual
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
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);
```

### Jika ada masalah dengan foreign keys:
```sql
-- Pastikan tabel users dan packages sudah dibuat terlebih dahulu
-- Jalankan query dalam urutan yang benar:
-- 1. users
-- 2. packages  
-- 3. user_packages
-- 4. transactions
-- 5. referrals
-- 6. daily_claims
-- 7. admin_users
```

## Default Credentials

### Admin User
- **Username:** admin
- **Password:** admin123
- **Email:** admin@investbot.com

### Sample Packages
1. **Paket Starter** - Rp 100.000 (30 hari, 2.5% harian)
2. **Paket Silver** - Rp 500.000 (60 hari, 3.0% harian)
3. **Paket Gold** - Rp 1.000.000 (90 hari, 3.5% harian)
4. **Paket Platinum** - Rp 5.000.000 (120 hari, 4.0% harian)

## Next Steps

Setelah database berhasil dibuat:
1. Update file `.env` dengan kredensial database
2. Jalankan backend server
3. Test koneksi database
4. Mulai development aplikasi
