/**
 * Configuration settings untuk Invest Bot Backend
 * Menggunakan environment variables dengan default values
 */

const config = {
  // Server settings
  server: {
    port: process.env.PORT || 8000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development'
  },

  // Database settings
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'invest_bot_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  // Telegram Bot settings
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || 'your_bot_token_here',
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || '',
    polling: process.env.TELEGRAM_POLLING !== 'false'
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // File upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    uploadDir: 'uploads/'
  },

  // CORS settings
  cors: {
    origins: [
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};

// Helper function untuk mendapatkan database URL
config.database.getUrl = () => {
  const { host, port, name, user, password } = config.database;
  return `mysql://${user}:${password}@${host}:${port}/${name}`;
};

// Helper function untuk print konfigurasi
config.print = () => {
  console.log('🔧 Current Configuration:');
  console.log(`   Server: ${config.server.host}:${config.server.port}`);
  console.log(`   Environment: ${config.server.env}`);
  console.log(`   Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
  console.log(`   Database User: ${config.database.user}`);
  console.log(`   Database Password: ${config.database.password ? '***' : 'Not set'}`);
  console.log(`   Bot Token: ${config.telegram.token !== 'your_bot_token_here' ? 'Set' : 'Not set'}`);
  console.log(`   JWT Secret: ${config.jwt.secret !== 'your-secret-key-change-this-in-production' ? 'Set' : 'Not set'}`);
};

module.exports = config;
