from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from sqlalchemy.orm import Session
from bot.utils.db import SessionLocal
from api.models.user import User
import secrets
import string
import logging

logger = logging.getLogger(__name__)

class AuthHandler:
    
    @staticmethod
    def generate_referral_code(length=8):
        """Generate unique referral code"""
        characters = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))
    
    @staticmethod
    async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user = update.effective_user
        
        # Check if user already exists
        db = SessionLocal()
        try:
            existing_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if existing_user:
                # User already exists, show main menu
                await AuthHandler.show_main_menu(update, context, existing_user)
            else:
                # New user, show welcome message
                await AuthHandler.show_welcome_message(update, context)
        finally:
            db.close()
    
    @staticmethod
    async def show_welcome_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show welcome message for new users"""
        welcome_text = """
🎉 Selamat datang di Bot Investasi!

Bot ini memungkinkan Anda untuk:
• Membeli paket investasi
• Mendapatkan return harian
• Sistem referral yang menguntungkan
• Dashboard lengkap untuk monitoring

Silakan daftar untuk memulai investasi Anda!
        """
        
        keyboard = [
            [InlineKeyboardButton("📝 Daftar Sekarang", callback_data="register")],
            [InlineKeyboardButton("📋 Lihat Paket", callback_data="view_packages")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(welcome_text, reply_markup=reply_markup)
    
    @staticmethod
    async def show_main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE, user: User):
        """Show main menu for existing users"""
        menu_text = f"""
👋 Halo {user.first_name or user.username or 'User'}!

💰 Saldo: Rp {user.balance:,.0f}
📈 Total Profit: Rp {user.total_profit:,.0f}
🎯 Referral Bonus: Rp {user.referral_bonus:,.0f}

Silakan pilih menu di bawah ini:
        """
        
        keyboard = [
            [InlineKeyboardButton("📦 Paket Investasi", callback_data="packages")],
            [InlineKeyboardButton("💸 Claim Harian", callback_data="daily_claim")],
            [InlineKeyboardButton("👥 Referral", callback_data="referral")],
            [InlineKeyboardButton("📊 Dashboard", callback_data="dashboard")],
            [InlineKeyboardButton("📋 Riwayat", callback_data="history")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        if update.message:
            await update.message.reply_text(menu_text, reply_markup=reply_markup)
        else:
            await update.callback_query.edit_message_text(menu_text, reply_markup=reply_markup)
    
    @staticmethod
    async def handle_register(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle user registration"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            # Check if user already exists
            existing_user = db.query(User).filter(User.telegram_id == user.id).first()
            if existing_user:
                await query.edit_message_text("❌ Anda sudah terdaftar!")
                return
            
            # Generate referral code
            referral_code = AuthHandler.generate_referral_code()
            while db.query(User).filter(User.referral_code == referral_code).first():
                referral_code = AuthHandler.generate_referral_code()
            
            # Create new user
            new_user = User(
                telegram_id=user.id,
                username=user.username,
                first_name=user.first_name,
                last_name=user.last_name,
                referral_code=referral_code,
                balance=0.0
            )
            
            db.add(new_user)
            db.commit()
            
            success_text = f"""
✅ Pendaftaran berhasil!

🎯 Referral Code Anda: `{referral_code}`
💰 Saldo awal: Rp 0

Bagikan referral code Anda kepada teman untuk mendapatkan bonus!
            """
            
            keyboard = [[InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(success_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error during registration: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat pendaftaran. Silakan coba lagi.")
        finally:
            db.close()
    
    @staticmethod
    async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle callback queries"""
        query = update.callback_query
        data = query.data
        
        if data == "register":
            await AuthHandler.handle_register(update, context)
        elif data == "main_menu":
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.telegram_id == update.effective_user.id).first()
                if user:
                    await AuthHandler.show_main_menu(update, context, user)
            finally:
                db.close()
        # Other callbacks will be handled by respective handlers
