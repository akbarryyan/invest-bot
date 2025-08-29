/**
 * Start script untuk Invest Bot Backend
 */

const { testConnection, syncDatabase, closeConnection } = require('./src/database/connection');
const config = require('./src/config');

async function startBackend() {
  try {
    console.log('🚀 Starting Invest Bot Backend...');
    
    // Print configuration
    console.log('\n📋 Configuration:');
    console.log(`   Environment: ${config.server.env}`);
    console.log(`   Port: ${config.server.port}`);
    console.log(`   Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
    
    // Test database connection
    console.log('\n🔌 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.log('❌ Database connection failed!');
      console.log('💡 Please check:');
      console.log('   1. MySQL server is running');
      console.log('   2. Database exists: ' + config.database.name);
      console.log('   3. User credentials are correct');
      console.log('   4. Network connectivity');
      process.exit(1);
    }
    
    // Sync database models
    console.log('\n🔄 Syncing database models...');
    const synced = await syncDatabase(false);
    
    if (!synced) {
      console.log('❌ Database sync failed!');
      process.exit(1);
    }
    
    // Close test connection
    await closeConnection();
    
    // Start server
    console.log('\n🌐 Starting Express server...');
    require('./src/server');
    
  } catch (error) {
    console.error('❌ Failed to start backend:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  startBackend();
}

module.exports = startBackend;
