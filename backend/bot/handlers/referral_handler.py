from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from bot.utils.db import SessionLocal
from api.models.user import User
from api.models.referral import Referral
import logging

logger = logging.getLogger(__name__)

class ReferralHandler:
    
    @staticmethod
    async def show_referral_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show referral information for user"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            # Get referral statistics
            total_referrals = db.query(Referral).filter(Referral.referrer_id == db_user.id).count()
            total_bonus = db_user.referral_bonus
            
            referral_text = f"""
👥 **Sistem Referral**

🎯 **Referral Code Anda:** `{db_user.referral_code}`
👥 **Total Referral:** {total_referrals} orang
💰 **Total Bonus:** Rp {total_bonus:,.0f}

**Cara Kerja:**
1. Bagikan referral code Anda kepada teman
2. Teman mendaftar menggunakan code Anda
3. Anda mendapat bonus Rp 100,000 per referral
4. Bonus langsung masuk ke saldo Anda

**Link Referral:**
`https://t.me/your_bot_username?start={db_user.referral_code}`

Bagikan referral code Anda sekarang!
            """
            
            keyboard = [
                [InlineKeyboardButton("📤 Bagikan Referral", callback_data="share_referral")],
                [InlineKeyboardButton("👥 Lihat Referral", callback_data="view_referrals")],
                [InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(referral_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error showing referral info: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat menampilkan info referral.")
        finally:
            db.close()
    
    @staticmethod
    async def show_referral_list(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show list of user's referrals"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            # Get referrals
            referrals = db.query(Referral).filter(Referral.referrer_id == db_user.id).all()
            
            if not referrals:
                referral_text = """
👥 **Daftar Referral**

Anda belum memiliki referral.
Bagikan referral code Anda kepada teman untuk mendapatkan bonus!
                """
                
                keyboard = [
                    [InlineKeyboardButton("📤 Bagikan Referral", callback_data="share_referral")],
                    [InlineKeyboardButton("🔙 Kembali", callback_data="referral")]
                ]
                reply_markup = InlineKeyboardMarkup(keyboard)
                
                await query.edit_message_text(referral_text, reply_markup=reply_markup, parse_mode='Markdown')
                return
            
            referral_text = f"""
👥 **Daftar Referral Anda**

Total: {len(referrals)} referral

"""
            
            for i, referral in enumerate(referrals, 1):
                referred_user = db.query(User).filter(User.id == referral.referred_id).first()
                if referred_user:
                    referral_text += f"""
**{i}. {referred_user.first_name or referred_user.username or 'User'}**
💰 Bonus: Rp {referral.bonus_amount:,.0f}
📅 Tanggal: {referral.created_at.strftime('%d/%m/%Y')}
✅ Status: {'Dibayar' if referral.is_paid else 'Pending'}

"""
            
            keyboard = [
                [InlineKeyboardButton("📤 Bagikan Referral", callback_data="share_referral")],
                [InlineKeyboardButton("🔙 Kembali", callback_data="referral")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(referral_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error showing referral list: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat menampilkan daftar referral.")
        finally:
            db.close()
    
    @staticmethod
    async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle referral-related callbacks"""
        query = update.callback_query
        data = query.data
        
        if data == "referral":
            await ReferralHandler.show_referral_info(update, context)
        elif data == "view_referrals":
            await ReferralHandler.show_referral_list(update, context)
        elif data == "share_referral":
            # This would open share dialog in actual implementation
            await query.answer("Fitur share referral akan segera tersedia!")
