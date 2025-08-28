from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from bot.utils.db import SessionLocal
from api.models.user import User
from api.models.transaction import Transaction
import logging

logger = logging.getLogger(__name__)

class UserHandler:
    
    @staticmethod
    async def show_dashboard(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show user dashboard"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            # Get transaction statistics
            total_transactions = db.query(Transaction).filter(Transaction.user_id == db_user.id).count()
            recent_transactions = db.query(Transaction).filter(
                Transaction.user_id == db_user.id
            ).order_by(Transaction.created_at.desc()).limit(5).all()
            
            dashboard_text = f"""
📊 **Dashboard User**

👤 **Profil:**
• Nama: {db_user.first_name or db_user.username or 'User'}
• Username: @{db_user.username or 'Tidak ada'}
• Member Sejak: {db_user.created_at.strftime('%d/%m/%Y')}

💰 **Keuangan:**
• Saldo: Rp {db_user.balance:,.0f}
• Total Profit: Rp {db_user.total_profit:,.0f}
• Referral Bonus: Rp {db_user.referral_bonus:,.0f}

📈 **Aktivitas:**
• Total Transaksi: {total_transactions}
• Referral Code: `{db_user.referral_code}`

**Transaksi Terbaru:**
            """
            
            if recent_transactions:
                for i, trans in enumerate(recent_transactions, 1):
                    dashboard_text += f"""
{i}. {trans.transaction_type.title()} - Rp {trans.amount:,.0f}
   Status: {trans.status} | {trans.created_at.strftime('%d/%m %H:%M')}
                    """
            else:
                dashboard_text += "\nBelum ada transaksi."
            
            keyboard = [
                [InlineKeyboardButton("💸 Claim Harian", callback_data="daily_claim")],
                [InlineKeyboardButton("📦 Paket Investasi", callback_data="packages")],
                [InlineKeyboardButton("👥 Referral", callback_data="referral")],
                [InlineKeyboardButton("📋 Riwayat Lengkap", callback_data="history")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(dashboard_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error showing dashboard: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat menampilkan dashboard.")
        finally:
            db.close()
    
    @staticmethod
    async def show_transaction_history(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show user transaction history"""
        query = update.callback_query
        await query.answer()
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            # Get all transactions
            transactions = db.query(Transaction).filter(
                Transaction.user_id == db_user.id
            ).order_by(Transaction.created_at.desc()).limit(20).all()
            
            if not transactions:
                history_text = """
📋 **Riwayat Transaksi**

Anda belum memiliki transaksi apapun.
Mulai investasi sekarang untuk melihat riwayat transaksi!
                """
                
                keyboard = [
                    [InlineKeyboardButton("📦 Lihat Paket", callback_data="packages")],
                    [InlineKeyboardButton("🔙 Kembali", callback_data="dashboard")]
                ]
                reply_markup = InlineKeyboardMarkup(keyboard)
                
                await query.edit_message_text(history_text, reply_markup=reply_markup, parse_mode='Markdown')
                return
            
            history_text = f"""
📋 **Riwayat Transaksi**

Total: {len(transactions)} transaksi

"""
            
            for i, trans in enumerate(transactions, 1):
                status_emoji = {
                    'completed': '✅',
                    'pending': '⏳',
                    'failed': '❌',
                    'cancelled': '🚫'
                }.get(trans.status, '❓')
                
                history_text += f"""
**{i}. {trans.transaction_type.title()}**
{status_emoji} Status: {trans.status}
💰 Jumlah: Rp {trans.amount:,.0f}
📅 Tanggal: {trans.created_at.strftime('%d/%m/%Y %H:%M')}
📝 Deskripsi: {trans.description or 'Tidak ada deskripsi'}

"""
            
            keyboard = [
                [InlineKeyboardButton("🔙 Kembali ke Dashboard", callback_data="dashboard")],
                [InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(history_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error showing transaction history: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat menampilkan riwayat transaksi.")
        finally:
            db.close()
    
    @staticmethod
    async def show_topup_options(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show top-up options for user"""
        query = update.callback_query
        await query.answer()
        
        topup_text = """
💳 **Top Up Saldo**

Pilih metode top up yang tersedia:

💰 **Bank Transfer:**
• BCA: 1234567890 (a.n. Invest Bot)
• Mandiri: 0987654321 (a.n. Invest Bot)
• BNI: 1122334455 (a.n. Invest Bot)

📱 **E-Wallet:**
• OVO: 081234567890
• DANA: 081234567890
• GoPay: 081234567890

**Cara Top Up:**
1. Pilih metode pembayaran
2. Transfer sesuai nominal
3. Kirim bukti transfer ke admin
4. Saldo akan ditambahkan dalam 1x24 jam

**Minimal Top Up:** Rp 50,000
**Maksimal Top Up:** Rp 10,000,000

Silakan pilih metode pembayaran yang diinginkan!
        """
        
        keyboard = [
            [InlineKeyboardButton("🏦 Bank Transfer", callback_data="topup_bank")],
            [InlineKeyboardButton("📱 E-Wallet", callback_data="topup_ewallet")],
            [InlineKeyboardButton("🔙 Kembali", callback_data="main_menu")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(topup_text, reply_markup=reply_markup, parse_mode='Markdown')
    
    @staticmethod
    async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle user-related callbacks"""
        query = update.callback_query
        data = query.data
        
        if data == "dashboard":
            await UserHandler.show_dashboard(update, context)
        elif data == "history":
            await UserHandler.show_transaction_history(update, context)
        elif data == "topup":
            await UserHandler.show_topup_options(update, context)
        elif data.startswith("topup_"):
            await query.answer("Fitur top up akan segera tersedia!")
