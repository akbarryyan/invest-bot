# Invest Bot Admin Dashboard

Admin dashboard modern untuk mengelola bot investasi Telegram, dibangun dengan React + TypeScript + Tailwind CSS.

## Fitur

- 📊 Dashboard monitoring real-time
- 📦 Manajemen paket investasi (CRUD)
- 👥 Manajemen user dan saldo
- 💰 Monitoring transaksi
- 📈 Analytics dan reporting
- 🔐 Sistem autentikasi admin
- 📱 Responsive design

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Heroicons** - Icon set
- **Vite** - Build tool

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser ke `http://localhost:5173`

## Build untuk Production

```bash
npm run build
```

## Struktur Project

```
src/
├── components/          # Komponen React
│   ├── Layout.tsx      # Layout utama
│   ├── Sidebar.tsx     # Sidebar navigasi
│   └── Header.tsx      # Header dashboard
├── pages/              # Halaman admin
│   └── Dashboard.tsx   # Dashboard utama
├── types/              # TypeScript types
│   └── index.ts        # Definisi types
├── utils/              # Utility functions
│   └── api.ts          # API client
├── App.tsx             # App utama
└── main.tsx            # Entry point
```

## Komponen

### Layout
- **Layout.tsx** - Wrapper utama dengan sidebar dan header
- **Sidebar.tsx** - Navigasi sidebar dengan menu admin
- **Header.tsx** - Header dengan user info dan notifications

### Pages
- **Dashboard.tsx** - Dashboard utama dengan stats dan quick actions

### Utils
- **api.ts** - Client untuk komunikasi dengan backend API

## API Integration

Dashboard terintegrasi dengan backend FastAPI melalui:
- Authentication endpoints
- CRUD operations untuk packages, users, transactions
- Real-time data fetching

## Styling

Menggunakan Tailwind CSS untuk:
- Responsive design
- Modern UI components
- Consistent spacing dan colors
- Dark/light mode support (akan ditambahkan)

## Development

### Menambah Halaman Baru
1. Buat file di `src/pages/`
2. Tambahkan route di `App.tsx`
3. Tambahkan menu di `Sidebar.tsx`

### Menambah Komponen Baru
1. Buat file di `src/components/`
2. Export component
3. Import dan gunakan di halaman

### Styling
- Gunakan Tailwind CSS classes
- Ikuti design system yang ada
- Responsive untuk mobile dan desktop

## Deployment

1. Build project: `npm run build`
2. Deploy folder `dist/` ke hosting
3. Update API base URL di `utils/api.ts`

## Contributing

1. Fork project
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## License

MIT License
