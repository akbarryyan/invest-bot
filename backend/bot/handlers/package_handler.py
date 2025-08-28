from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from bot.utils.db import SessionLocal
from api.models.user import User
from api.models.package import Package
from api.models.transaction import Transaction
import logging

logger = logging.getLogger(__name__)

class PackageHandler:
    
    @staticmethod
    async def show_packages(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Show available investment packages"""
        query = update.callback_query
        await query.answer()
        
        db = SessionLocal()
        try:
            packages = db.query(Package).filter(Package.is_active == True).all()
            
            if not packages:
                await query.edit_message_text("❌ Tidak ada paket investasi yang tersedia saat ini.")
                return
            
            packages_text = "📦 **Paket Investasi Tersedia:**\n\n"
            
            for i, package in enumerate(packages, 1):
                packages_text += f"""
**{i}. {package.name}**
💰 Harga: Rp {package.price:,.0f}
⏱️ Durasi: {package.duration_days} hari
📈 Return Harian: {package.daily_return:.2f}%
📝 Deskripsi: {package.description or 'Tidak ada deskripsi'}

"""
            
            keyboard = []
            for i, package in enumerate(packages, 1):
                keyboard.append([InlineKeyboardButton(
                    f"🛒 Beli {package.name}", 
                    callback_data=f"buy_package_{package.id}"
                )])
            
            keyboard.append([InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")])
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(
                packages_text, 
                reply_markup=reply_markup, 
                parse_mode='Markdown'
            )
            
        except Exception as e:
            logger.error(f"Error showing packages: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat menampilkan paket.")
        finally:
            db.close()
    
    @staticmethod
    async def handle_buy_package(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle package purchase"""
        query = update.callback_query
        await query.answer()
        
        data = query.data
        package_id = int(data.split('_')[2])
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            # Get user and package
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            package = db.query(Package).filter(Package.id == package_id).first()
            
            if not db_user:
                await query.edit_message_text("❌ Anda harus login terlebih dahulu!")
                return
            
            if not package:
                await query.edit_message_text("❌ Paket tidak ditemukan!")
                return
            
            if not package.is_active:
                await query.edit_message_text("❌ Paket tidak tersedia!")
                return
            
            # Check user balance
            if db_user.balance < package.price:
                insufficient_text = f"""
❌ Saldo tidak mencukupi!

💰 Saldo Anda: Rp {db_user.balance:,.0f}
💳 Harga Paket: Rp {package.price:,.0f}
💸 Kurang: Rp {package.price - db_user.balance:,.0f}

Silakan top up saldo terlebih dahulu!
                """
                
                keyboard = [
                    [InlineKeyboardButton("💳 Top Up Saldo", callback_data="topup")],
                    [InlineKeyboardButton("📦 Lihat Paket Lain", callback_data="packages")],
                    [InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")]
                ]
                reply_markup = InlineKeyboardMarkup(keyboard)
                
                await query.edit_message_text(insufficient_text, reply_markup=reply_markup)
                return
            
            # Confirm purchase
            confirm_text = f"""
🛒 **Konfirmasi Pembelian**

📦 Paket: {package.name}
💰 Harga: Rp {package.price:,.0f}
⏱️ Durasi: {package.duration_days} hari
📈 Return Harian: {package.daily_return:.2f}%
💵 Saldo Setelah Pembelian: Rp {db_user.balance - package.price:,.0f}

Apakah Anda yakin ingin membeli paket ini?
                """
            
            keyboard = [
                [
                    InlineKeyboardButton("✅ Ya, Beli Sekarang", callback_data=f"confirm_buy_{package.id}"),
                    InlineKeyboardButton("❌ Batal", callback_data="packages")
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(confirm_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error handling buy package: {e}")
            await query.edit_message_text("❌ Terjadi kesalahan saat memproses pembelian.")
        finally:
            db.close()
    
    @staticmethod
    async def confirm_purchase(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Confirm and process package purchase"""
        query = update.callback_query
        await query.answer()
        
        data = query.data
        package_id = int(data.split('_')[2])
        
        user = update.effective_user
        
        db = SessionLocal()
        try:
            # Get user and package
            db_user = db.query(User).filter(User.telegram_id == user.id).first()
            package = db.query(Package).filter(Package.id == package_id).first()
            
            if not db_user or not package:
                await query.edit_message_text("❌ Data tidak valid!")
                return
            
            # Process purchase
            db_user.balance -= package.price
            
            # Create transaction record
            transaction = Transaction(
                user_id=db_user.id,
                package_id=package.id,
                transaction_type='purchase',
                amount=package.price,
                status='completed',
                description=f"Pembelian paket {package.name}"
            )
            
            db.add(transaction)
            db.commit()
            
            success_text = f"""
✅ **Pembelian Berhasil!**

📦 Paket: {package.name}
💰 Harga: Rp {package.price:,.0f}
⏱️ Durasi: {package.duration_days} hari
📈 Return Harian: {package.daily_return:.2f}%
💵 Saldo Sekarang: Rp {db_user.balance:,.0f}

Paket akan aktif selama {package.duration_days} hari.
Anda dapat melakukan claim harian sesuai return yang ditentukan.
                """
            
            keyboard = [
                [InlineKeyboardButton("💸 Claim Harian", callback_data="daily_claim")],
                [InlineKeyboardButton("📦 Lihat Paket Lain", callback_data="packages")],
                [InlineKeyboardButton("🏠 Menu Utama", callback_data="main_menu")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(success_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error confirming purchase: {e}")
            db.rollback()
            await query.edit_message_text("❌ Terjadi kesalahan saat memproses pembelian.")
        finally:
            db.close()
    
    @staticmethod
    async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle package-related callbacks"""
        query = update.callback_query
        data = query.data
        
        if data == "packages":
            await PackageHandler.show_packages(update, context)
        elif data.startswith("buy_package_"):
            await PackageHandler.handle_buy_package(update, context)
        elif data.startswith("confirm_buy_"):
            await PackageHandler.confirm_purchase(update, context)
