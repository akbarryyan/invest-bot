# API Integration Setup Guide

## Overview
Frontend sekarang sudah terintegrasi dengan API calls yang sebenarnya, menggantikan mock data. Berikut adalah panduan setup dan konfigurasi.

## 🚀 **Struktur File yang Baru:**

### **1. Types (Typescript)**
```
frontend/src/types/
├── index.ts          # Semua types dalam satu file
```

### **2. API Services**
```
frontend/src/services/
├── api.ts            # API client service
```

### **3. Custom Hooks**
```
frontend/src/hooks/
├── useUsers.ts       # Hook untuk user management
```

## 📋 **Fitur yang Sudah Diimplementasi:**

### **✅ API Integration:**
- **User Management**: CRUD operations dengan API calls
- **Error Handling**: Proper error handling dan display
- **Loading States**: Loading indicators untuk semua operations
- **Real-time Updates**: Data ter-update otomatis setelah CRUD operations

### **✅ User Features:**
- **Create User**: Modal form dengan validasi
- **Update User**: Edit user data dengan form yang pre-filled
- **Delete User**: Confirmation modal dengan warning
- **Search & Filter**: Client-side filtering berdasarkan nama, username, status
- **Grid/List View**: Toggle antara grid dan list view
- **Statistics**: Real-time stats dari API

## 🔧 **Setup Instructions:**

### **1. Environment Configuration**
```bash
# Copy environment example
cp frontend/.env.example frontend/.env

# Update API URL sesuai backend Anda
VITE_API_URL=http://localhost:8000/api
```

### **2. Backend API Endpoints yang Dibutuhkan:**

#### **User Endpoints:**
```typescript
// GET /api/users - Get all users with pagination and filters
GET /api/users?search=john&status=active&page=1&limit=10

// GET /api/users/{id} - Get user by ID
GET /api/users/1

// POST /api/users - Create new user
POST /api/users
{
  "telegram_id": 123456789,
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "referral_code": "JOHN123",
  "referred_by": "ADMIN001"
}

// PUT /api/users/{id} - Update user
PUT /api/users/1
{
  "username": "john_updated",
  "first_name": "John",
  "last_name": "Doe Updated",
  "balance": 2500000,
  "total_profit": 750000,
  "referral_bonus": 50000,
  "is_active": true
}

// DELETE /api/users/{id} - Delete user
DELETE /api/users/1

// GET /api/users/stats - Get user statistics
GET /api/users/stats
```

#### **Dashboard Endpoints:**
```typescript
// GET /api/dashboard/stats - Get dashboard statistics
GET /api/dashboard/stats

// GET /api/dashboard/recent-activity - Get recent activity
GET /api/dashboard/recent-activity
```

### **3. Response Format yang Diharapkan:**

#### **User Response:**
```typescript
{
  "success": true,
  "data": {
    "id": 1,
    "telegram_id": 123456789,
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "balance": 2500000,
    "total_profit": 750000,
    "referral_code": "JOHN123",
    "referred_by": "ADMIN001",
    "referral_bonus": 50000,
    "is_active": true,
    "created_at": "2024-01-15T00:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  },
  "message": "User created successfully"
}
```

#### **Paginated Response:**
```typescript
{
  "success": true,
  "data": [
    // Array of users
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  },
  "message": "Users retrieved successfully"
}
```

#### **Error Response:**
```typescript
{
  "success": false,
  "error": "User not found",
  "message": "The requested user could not be found"
}
```

## 🎯 **Testing API Integration:**

### **1. Start Development Server:**
```bash
cd frontend
npm run dev
```

### **2. Test Features:**
- **Create User**: Klik "Add New User" dan isi form
- **Edit User**: Klik tombol "Edit" pada user card/row
- **Delete User**: Klik tombol "Delete" dan konfirmasi
- **Search**: Ketik di search box untuk filter users
- **Status Filter**: Pilih status filter untuk filter users

### **3. Check Network Tab:**
- Buka Developer Tools → Network tab
- Lihat API calls yang dibuat saat melakukan operasi
- Pastikan response format sesuai dengan yang diharapkan

## 🔍 **Troubleshooting:**

### **Error: "Network error occurred"**
- Pastikan backend server berjalan di `http://localhost:8000`
- Check `VITE_API_URL` di file `.env`
- Pastikan CORS sudah dikonfigurasi di backend

### **Error: "Failed to fetch users"**
- Check backend API endpoints
- Pastikan response format sesuai
- Check console untuk error details

### **Data tidak ter-load**
- Check Network tab untuk API calls
- Pastikan backend mengembalikan data dengan format yang benar
- Check console untuk error messages

## 📝 **Next Steps:**

### **1. Backend Implementation:**
- Implement semua API endpoints yang dibutuhkan
- Setup database dan models
- Implement authentication dan authorization
- Setup CORS untuk frontend

### **2. Frontend Enhancements:**
- Add pagination controls
- Implement server-side filtering
- Add toast notifications
- Add data export functionality
- Implement real-time updates dengan WebSocket

### **3. Additional Features:**
- User authentication
- Role-based access control
- Audit logging
- Data validation
- Rate limiting

## 🎉 **Keuntungan Implementasi Ini:**

1. **Real Data**: Tidak lagi menggunakan mock data
2. **Error Handling**: Proper error handling dan user feedback
3. **Loading States**: User experience yang lebih baik
4. **Type Safety**: Full TypeScript support
5. **Maintainable**: Clean architecture dengan separation of concerns
6. **Scalable**: Mudah untuk menambah fitur baru

Sekarang frontend sudah siap untuk terintegrasi dengan backend API yang sebenarnya! 🚀
