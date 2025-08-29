/**
 * Database setup script untuk Invest Bot
 */

const { testConnection, syncDatabase, closeConnection } = require('../src/database/connection');
const config = require('../src/config');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Print configuration
    config.print();
    
    // Test connection
    console.log('\n🔌 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.log('❌ Database connection failed. Please check your MySQL settings.');
      console.log('💡 Make sure MySQL server is running and database exists.');
      process.exit(1);
    }
    
    // Sync database (create tables)
    console.log('\n🔄 Syncing database models...');
    const synced = await syncDatabase(false); // false = don't force recreate
    
    if (!synced) {
      console.log('❌ Database sync failed.');
      process.exit(1);
    }
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('💡 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run setup if this file is run directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
