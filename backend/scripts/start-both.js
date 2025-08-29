#!/usr/bin/env node
/**
 * Script untuk start API dan Bot bersamaan
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Invest Bot (API + Bot)...');

// Start API server
console.log('\n🌐 Starting API server...');
const apiProcess = spawn('node', [path.join(__dirname, '../src/server.js')], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

// Wait a bit for API to start
setTimeout(() => {
  console.log('\n🤖 Starting Telegram bot...');
  const botProcess = spawn('node', [path.join(__dirname, 'start-bot.js')], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Handle bot process termination
  botProcess.on('close', (code) => {
    console.log(`\n🤖 Bot process exited with code ${code}`);
    apiProcess.kill();
  });
  
}, 3000);

// Handle API process termination
apiProcess.on('close', (code) => {
  console.log(`\n🌐 API process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down services...');
  apiProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down services...');
  apiProcess.kill();
  process.exit(0);
});
