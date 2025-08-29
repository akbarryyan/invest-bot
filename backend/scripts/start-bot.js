#!/usr/bin/env node
/**
 * Script untuk start Telegram Bot
 */

const InvestBot = require('../src/bot/bot');

console.log('🤖 Starting Invest Bot...');

try {
  const bot = new InvestBot();
  bot.start();
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bot...');
    bot.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down bot...');
    bot.stop();
    process.exit(0);
  });
  
} catch (error) {
  console.error('❌ Error starting bot:', error);
  process.exit(1);
}
