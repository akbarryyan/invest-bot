from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from bot.utils.db import SessionLocal
from api.models.user import User
from api.models.transaction import Transaction
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

class ClaimHandler:
    
    @staticmethod
    async def show_daily_claim(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show daily claim interface"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            # Get user's active packages
            # Note: This would need a user_packages table in the actual implementation
            # For now, we'll show a placeholder
            
            claim_text = f"""
💸 **Daily Claim**

💰 Saldo Anda: Rp {db_user.balance:,.0f}
📈 Total Profit: Rp {db_user.total_profit:,.0f}

Untuk saat ini, fitur claim harian sedang dalam pengembangan.
Silakan cek kembali nanti!
            """
            
            keyboard = [
                [InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")],
                [InlineKeyboardButton("📦 Lihat Paket", callback_data="packages")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(claim_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error showing daily claim: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat menampilkan claim harian.")
        finally:
            db.close()
    
    @staticmethod
    async def process_daily_claim(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Process daily claim for user"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            # Check if user has already claimed today
            today = date.today()
            
            # This would check against daily_claims table in actual implementation
            # For now, we'll show a placeholder message
            
            claim_text = f"""
✅ **Claim Berhasil!**

💰 Saldo Sebelum: Rp {db_user.balance:,.0f}
💸 Claim Amount: Rp 25,000
💰 Saldo Sekarang: Rp {db_user.balance + 25000:,.0f}

Claim harian Anda untuk hari ini telah diproses.
Silakan cek kembali besok!
            """
            
            keyboard = [
                [InlineKeyboardButton("💸 Claim Lagi", callback_data="daily_claim")],
                [InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(claim_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error processing daily claim: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat memproses claim.")
        finally:
            db.close()
    
    @staticmethod
    async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle claim-related callbacks"""
        query = update.callback_query
        data = query.data
        
        if data == "daily_claim":
            await ClaimHandler.show_daily_claim(update, context)
        elif data.startswith("claim_"):
            await ClaimHandler.process_daily_claim(update, context)
