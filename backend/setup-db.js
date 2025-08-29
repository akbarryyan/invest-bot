/**
 * Setup Database untuk Invest Bot
 * Script sederhana untuk setup database
 */

const mysql = require('mysql2/promise');
const config = require('./src/config');

async function setupDatabase() {
  console.log('🚀 Setting up database untuk Invest Bot...\n');
  
  // Print config
  config.print();
  console.log('');
  
  try {
    // 1. Connect ke MySQL server (tanpa database)
    console.log('🔌 Connecting ke MySQL server...');
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password
    });
    
    console.log('✅ Connected ke MySQL server!');
    
    // 2. Buat database jika belum ada
    console.log('\n🗄️  Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database.name}\``);
    console.log(`✅ Database '${config.database.name}' ready!`);
    
    // 3. Use database
    await connection.execute(`USE \`${config.database.name}\``);
    
    // 4. Buat tabel users
    console.log('\n👥 Creating users table...');
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        telegram_id VARCHAR(50) UNIQUE NOT NULL,
        username VARCHAR(100),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(100),
        balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
        total_profit DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
        referral_code VARCHAR(20) UNIQUE,
        referred_by INT,
        referral_bonus DECIMAL(15,2) DEFAULT 0.00,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE NOT NULL,
        last_activity DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_telegram_id (telegram_id),
        INDEX idx_referral_code (referral_code),
        INDEX idx_is_active (is_active),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createUsersTable);
    console.log('✅ Users table created!');
    
    // 5. Insert sample user untuk testing
    console.log('\n👤 Inserting sample user...');
    const insertSampleUser = `
      INSERT IGNORE INTO users (
        telegram_id, username, first_name, last_name, 
        balance, total_profit, referral_code, is_active, is_admin
      ) VALUES (
        '123456789', 'admin_user', 'Admin', 'User',
        1000000.00, 50000.00, 'ADMIN001', TRUE, TRUE
      )
    `;
    
    await connection.execute(insertSampleUser);
    console.log('✅ Sample user inserted!');
    
    // 6. Test query
    console.log('\n🧪 Testing database...');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Database working! Total users: ${rows[0].count}`);
    
    // 7. Close connection
    await connection.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Run: npm start');
    console.log('   2. Open frontend di browser');
    console.log('   3. Test CRUD operations');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Pastikan MySQL server running');
    console.log('   2. Check username/password MySQL');
    console.log('   3. Pastikan port 3306 available');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
