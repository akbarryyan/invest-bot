/**
 * Telegram Bot untuk Invest Bot
 */

const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const { testConnection } = require('../database/connection');
const User = require('../models/User');
const Package = require('../models/Package');

class InvestBot {
  constructor() {
    this.bot = new TelegramBot(config.telegram.token, {
      polling: config.telegram.polling
    });
    
    this.setupCommands();
    this.setupHandlers();
  }

  setupCommands() {
    // Set bot commands
    this.bot.setMyCommands([
      { command: '/start', description: 'Mulai bot dan lihat menu utama' },
      { command: '/help', description: 'Bantuan dan daftar perintah' },
      { command: '/packages', description: 'Lihat paket investasi yang tersedia' },
      { command: '/portfolio', description: 'Lihat portfolio investasi Anda' },
      { command: '/balance', description: 'Cek saldo akun' },
      { command: '/claim', description: 'Claim return harian' },
      { command: '/referral', description: 'Sistem referral dan bonus' },
      { command: '/profile', description: 'Profil pengguna' }
    ]);
  }

  setupHandlers() {
    // Start command
    this.bot.onText(/\/start/, this.handleStart.bind(this));
    
    // Help command
    this.bot.onText(/\/help/, this.handleHelp.bind(this));
    
    // Packages command
    this.bot.onText(/\/packages/, this.handlePackages.bind(this));
    
    // Portfolio command
    this.bot.onText(/\/portfolio/, this.handlePortfolio.bind(this));
    
    // Balance command
    this.bot.onText(/\/balance/, this.handleBalance.bind(this));
    
    // Claim command
    this.bot.onText(/\/claim/, this.handleClaim.bind(this));
    
    // Referral command
    this.bot.onText(/\/referral/, this.handleReferral.bind(this));
    
    // Profile command
    this.bot.onText(/\/profile/, this.handleProfile.bind(this));
    
    // Handle callback queries
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
    
    // Handle errors
    this.bot.on('error', this.handleError.bind(this));
  }

  async handleStart(msg) {
    const chatId = msg.chat.id;
    const user = msg.from;
    
    try {
      // Check if user exists in database
      let dbUser = await User.findByTelegramId(user.id.toString());
      
      if (!dbUser) {
        // Create new user
        dbUser = await User.create({
          telegram_id: user.id.toString(),
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          referral_code: this.generateReferralCode()
        });
      }
      
      const welcomeMessage = `
🚀 **Selamat datang di Invest Bot!**

Halo ${user.first_name}! 👋

💰 **Fitur Utama:**
• Paket investasi dengan return harian
• Sistem referral dengan bonus
• Portfolio tracking
• Claim return otomatis

📱 **Gunakan menu di bawah atau ketik perintah:**
/help - Bantuan lengkap
/packages - Lihat paket investasi
/portfolio - Portfolio Anda
/balance - Cek saldo
/claim - Claim return harian
/referral - Sistem referral
/profile - Profil pengguna

💡 **Mulai investasi sekarang!**
      `;
      
      this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handleStart:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;
    
    const helpMessage = `
📚 **Bantuan Invest Bot**

🔹 **Perintah Dasar:**
/start - Mulai bot dan lihat menu utama
/help - Tampilkan bantuan ini

💰 **Investasi:**
/packages - Lihat paket investasi yang tersedia
/portfolio - Lihat portfolio investasi Anda
/balance - Cek saldo akun
/claim - Claim return harian

👥 **Referral:**
/referral - Sistem referral dan bonus
/profile - Profil pengguna

💡 **Cara Investasi:**
1. Lihat paket dengan /packages
2. Pilih paket yang sesuai
3. Transfer sesuai harga paket
4. Konfirmasi pembayaran
5. Paket akan aktif dan dapat return harian

❓ **Butuh bantuan lebih lanjut?**
Hubungi admin: @admin_username
      `;
    
    this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  }

  async handlePackages(msg) {
    const chatId = msg.chat.id;
    
    try {
      const packages = await Package.findAvailable();
      
      if (packages.length === 0) {
        this.bot.sendMessage(chatId, '❌ Tidak ada paket investasi yang tersedia saat ini.');
        return;
      }
      
      let message = '📦 **Paket Investasi yang Tersedia:**\n\n';
      
      packages.forEach((pkg, index) => {
        message += `**${index + 1}. ${pkg.name}**\n`;
        message += `💰 Harga: Rp ${pkg.price.toLocaleString()}\n`;
        message += `⏱️ Durasi: ${pkg.duration_days} hari\n`;
        message += `📈 Return Harian: ${pkg.daily_return_percentage}%\n`;
        message += `🎯 Total Return: ${pkg.total_return_percentage}%\n`;
        message += `📝 ${pkg.description || 'Tidak ada deskripsi'}\n\n`;
      });
      
      message += '💡 **Untuk membeli paket, hubungi admin:** @admin_username';
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handlePackages:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handlePortfolio(msg) {
    const chatId = msg.chat.id;
    
    try {
      const user = await User.findByTelegramId(msg.from.id.toString());
      
      if (!user) {
        this.bot.sendMessage(chatId, '❌ User tidak ditemukan. Silakan gunakan /start terlebih dahulu.');
        return;
      }
      
      // TODO: Implement portfolio logic
      const message = `
📊 **Portfolio Investasi**

👤 **User:** ${user.first_name}
💰 **Saldo:** Rp ${user.balance.toLocaleString()}
📈 **Total Investasi:** Rp 0 (belum ada investasi)
🎯 **Total Return:** Rp 0

💡 **Mulai investasi sekarang dengan /packages**
      `;
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handlePortfolio:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handleBalance(msg) {
    const chatId = msg.chat.id;
    
    try {
      const user = await User.findByTelegramId(msg.from.id.toString());
      
      if (!user) {
        this.bot.sendMessage(chatId, '❌ User tidak ditemukan. Silakan gunakan /start terlebih dahulu.');
        return;
      }
      
      const message = `
💰 **Saldo Akun**

👤 **User:** ${user.first_name}
💳 **Saldo:** Rp ${user.balance.toLocaleString()}
🆔 **Referral Code:** ${user.referral_code}

💡 **Top up saldo hubungi admin:** @admin_username
      `;
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handleBalance:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handleClaim(msg) {
    const chatId = msg.chat.id;
    
    try {
      const user = await User.findByTelegramId(msg.from.id.toString());
      
      if (!user) {
        this.bot.sendMessage(chatId, '❌ User tidak ditemukan. Silakan gunakan /start terlebih dahulu.');
        return;
      }
      
      // TODO: Implement daily claim logic
      const message = `
🎯 **Daily Claim**

👤 **User:** ${user.first_name}
💰 **Saldo:** Rp ${user.balance.toLocaleString()}
📅 **Status:** Belum ada paket aktif

💡 **Beli paket investasi terlebih dahulu dengan /packages**
      `;
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handleClaim:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handleReferral(msg) {
    const chatId = msg.chat.id;
    
    try {
      const user = await User.findByTelegramId(msg.from.id.toString());
      
      if (!user) {
        this.bot.sendMessage(chatId, '❌ User tidak ditemukan. Silakan gunakan /start terlebih dahulu.');
        return;
      }
      
      const message = `
👥 **Sistem Referral**

👤 **User:** ${user.first_name}
🆔 **Referral Code:** \`${user.referral_code}\`
💰 **Bonus Referral:** Rp 0 (belum ada referral)

📱 **Bagikan referral code Anda:**
\`${user.referral_code}\`

💡 **Setiap user yang mendaftar menggunakan kode Anda akan mendapat bonus!**
      `;
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handleReferral:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handleProfile(msg) {
    const chatId = msg.chat.id;
    
    try {
      const user = await User.findByTelegramId(msg.from.id.toString());
      
      if (!user) {
        this.bot.sendMessage(chatId, '❌ User tidak ditemukan. Silakan gunakan /start terlebih dahulu.');
        return;
      }
      
      const message = `
👤 **Profil Pengguna**

🆔 **Telegram ID:** ${user.telegram_id}
👤 **Nama:** ${user.first_name} ${user.last_name || ''}
📱 **Username:** @${user.username || 'Tidak ada'}
📧 **Email:** ${user.email || 'Tidak ada'}
📞 **Phone:** ${user.phone || 'Tidak ada'}
💰 **Saldo:** Rp ${user.balance.toLocaleString()}
🆔 **Referral Code:** ${user.referral_code}
👥 **Referred By:** ${user.referred_by ? 'Ya' : 'Tidak'}
📅 **Terdaftar:** ${user.createdAt.toLocaleDateString('id-ID')}
📊 **Status:** ${user.is_active ? 'Aktif' : 'Tidak Aktif'}
      `;
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
    } catch (error) {
      console.error('Error in handleProfile:', error);
      this.bot.sendMessage(chatId, '❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    }
  }

  async handleCallbackQuery(callbackQuery) {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    
    try {
      // Handle different callback data
      switch (data) {
        case 'packages':
          await this.handlePackages({ chat: { id: chatId } });
          break;
        case 'portfolio':
          await this.handlePortfolio({ chat: { id: chatId } });
          break;
        case 'balance':
          await this.handleBalance({ chat: { id: chatId } });
          break;
        case 'claim':
          await this.handleClaim({ chat: { id: chatId } });
          break;
        case 'referral':
          await this.handleReferral({ chat: { id: chatId } });
          break;
        case 'profile':
          await this.handleProfile({ chat: { id: chatId } });
          break;
        default:
          this.bot.answerCallbackQuery(callbackQuery.id, '❌ Perintah tidak dikenal');
      }
    } catch (error) {
      console.error('Error in handleCallbackQuery:', error);
      this.bot.answerCallbackQuery(callbackQuery.id, '❌ Terjadi kesalahan');
    }
  }

  handleError(error) {
    console.error('Bot error:', error);
  }

  generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  start() {
    console.log('🤖 Starting Telegram Bot...');
    console.log(`   Token: ${config.telegram.token.substring(0, 10)}...`);
    console.log(`   Polling: ${config.telegram.polling}`);
    
    // Test database connection
    testConnection().then(success => {
      if (success) {
        console.log('✅ Bot started successfully!');
      } else {
        console.log('⚠️ Bot started but database connection failed');
      }
    });
  }

  stop() {
    console.log('🛑 Stopping Telegram Bot...');
    this.bot.stopPolling();
    console.log('✅ Bot stopped successfully!');
  }
}

module.exports = InvestBot;
